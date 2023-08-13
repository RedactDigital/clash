import dayjs from 'dayjs';
import { config } from './config/index.config';
import type Clan from './database/models/Clan.model';
import ClanMember from './database/models/ClanMember.model';
import ClanMemberWarAttack from './database/models/ClanMemberWarAttack.model';
import ClanWar from './database/models/ClanWar.model';
import log from './utils/log';

enum WarState {
  NOT_IN_WAR = 'notInWar',
  IN_MATCHMAKING = 'inMatchmaking',
  PREPARATION = 'preparation',
  IN_WAR = 'inWar',
  ENDED = 'warEnded',
}

interface WarClan {
  tag: string;
  name: string;
  badgeUrls: {
    small: string;
    large: string;
    medium: string;
  };
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
  expEarned: number;
  members: Array<{
    tag: string;
    name: string;
    townhallLevel: number;
    mapPosition: number;
    opponentAttacks: number;
    bestOpponentAttack?: {
      order: number;
      attackerTag: string;
      defenderTag: string;
      stars: number;
      destructionPercentage: number;
      duration: number;
    };
    attacks?: Array<{
      order: number;
      attackerTag: string;
      defenderTag: string;
      stars: number;
      destructionPercentage: number;
      duration: number;
    }>;
  }>;
}

interface ClanWarResponse {
  clan: WarClan;
  opponent: WarClan;
  teamSize: number;
  attacksPerMember: number;
  startTime: string;
  endTime: string;
  preparationStartTime: string;
  state: WarState;
}

export const updateClanWar = async (clan: Clan): Promise<void> => {
  try {
    /**
     * Determine if the clan is in war, and if so, update the war data
     */
    const warReq = await fetch(`https://api.clashofclans.com/v1/clans/%23${clan.tag}/currentwar`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${config.get('clashOfClans.apiKey')}`,
      },
    });
    const warRes: ClanWarResponse | undefined = <ClanWarResponse>await warReq.json();

    if (warRes.state === WarState.NOT_IN_WAR) {
      log.info(`Clan ${clan.name} is not in war`);
      return;
    }

    const [war, noWarExists] = await ClanWar.findOrCreate({
      where: { clanId: clan.id, preparationStartTime: formatTimestamp(warRes.startTime) },
      defaults: {
        clanId: clan.id,
        state: warRes.state,
        teamSize: warRes.teamSize,
        destructionPercentage: String(warRes.clan.destructionPercentage),
        stars: warRes.clan.stars,
        attacks: warRes.clan.attacks,
        preparationStartTime: formatTimestamp(warRes.startTime),
        startTime: formatTimestamp(warRes.startTime),
        endTime: formatTimestamp(warRes.endTime),
      },
    });

    if (!noWarExists) {
      await war.update({
        clanId: clan.id,
        state: warRes.state,
        teamSize: warRes.teamSize,
        destructionPercentage: String(warRes.clan.destructionPercentage),
        stars: warRes.clan.stars,
        attacks: warRes.clan.attacks,
        preparationStartTime: formatTimestamp(warRes.startTime),
        startTime: formatTimestamp(warRes.startTime),
        endTime: formatTimestamp(warRes.endTime),
      });
    }

    await createAttacksInDatabase(warRes, war);

    /**
     * Once the war is inWar, we can start updating the war attacks periodically
     */
    await updateWarInfo(warRes, war);

    return void 0;
  } catch (err) {
    log.error(`Error while updating war attacks for clan ${clan.name}`, err);
    return void 0;
  }
};

const formatTimestamp = (timestamp: string): Date => {
  if (!timestamp) throw new Error('No timestamp provided');
  const [clashFormattedDate] = timestamp.split('T');

  return <Date>(<unknown>dayjs(clashFormattedDate).format('YYYY-MM-DD'));
};

const updateWarInfo = async (warRes: ClanWarResponse, war: ClanWar): Promise<void> => {
  try {
    if (warRes.state === WarState.IN_WAR || warRes.state === WarState.ENDED) {
      for (const member of warRes.clan.members) {
        /**
         * If the member has no attacks, the API doesn't return an array of attacks
         * in other words it returns undefined. If it is undefined, do nothing
         */
        if (!member.attacks) continue;

        /**
         * We need to get the member id from the database so we can update the correct member
         */
        const selectedMember = await ClanMember.findOne({ where: { tag: member.tag.replace('#', '') } });
        if (!selectedMember) throw new Error('Member not found while updating war attacks');

        /**
         * If the member has 1 attack, update the first attack in the database
         */
        if (member.attacks.length === 1) {
          await ClanMemberWarAttack.update(
            {
              defenderTag: member.attacks[0].defenderTag.replace('#', ''),
              stars: member.attacks[0].stars,
              destructionPercentage: member.attacks[0].destructionPercentage,
              duration: member.attacks[0].duration,
              order: 1,
            },
            {
              where: {
                clanWarId: war.id,
                memberId: selectedMember.id,
                order: 1,
              },
            },
          );
        }

        /**
         * If the member has 2 attacks, update the first and second attack in the database
         */
        if (member.attacks.length === 2) {
          await ClanMemberWarAttack.update(
            {
              defenderTag: member.attacks[0].defenderTag.replace('#', ''),
              stars: member.attacks[0].stars,
              destructionPercentage: member.attacks[0].destructionPercentage,
              duration: member.attacks[0].duration,
              order: 1,
            },
            {
              where: {
                clanWarId: war.id,
                memberId: selectedMember.id,
                order: 1,
              },
            },
          );

          await ClanMemberWarAttack.update(
            {
              defenderTag: member.attacks[1].defenderTag.replace('#', ''),
              stars: member.attacks[1].stars,
              destructionPercentage: member.attacks[1].destructionPercentage,
              duration: member.attacks[1].duration,
              order: 2,
            },
            {
              where: {
                clanWarId: war.id,
                memberId: selectedMember.id,
                order: 2,
              },
            },
          );
        }
      }
    }
  } catch (err) {
    log.error('Error while updating war info', err);
    return void 0;
  }
};

const createAttacksInDatabase = async (warRes: ClanWarResponse, war: ClanWar): Promise<void> => {
  try {
    /**
     * If the status of the war is preparation, we need to create the war lineup
     * so each member has 2 attacks in the database per war
     */
    if (warRes.state === WarState.PREPARATION) {
      const memberAttacks = await ClanMemberWarAttack.findAll({ where: { clanWarId: war.id } });
      if (memberAttacks.length === 0) {
        /**
         * Get all the members in war, and create an array of their tags so we can get their
         * member id from the database
         */
        const memberTags = warRes.clan.members.map((member) => member.tag.replace('#', ''));

        /**
         * Get all the members in the database with the tags we got from the war data
         */
        const members = await ClanMember.findAll({ where: { tag: memberTags } });

        /**
         * Loop through the members and create 2 attacks for each member
         */
        for (const member of members) {
          await ClanMemberWarAttack.create({
            memberId: member.id,
            clanWarId: war.id,
            stars: 0,
            destructionPercentage: 0,
            duration: 0,
            order: 1,
          });
          await ClanMemberWarAttack.create({
            memberId: member.id,
            clanWarId: war.id,
            stars: 0,
            destructionPercentage: 0,
            duration: 0,
            order: 2,
          });
        }
      }
    }
  } catch (err) {
    log.error('Error while creating attacks in database', err);
  }
};
