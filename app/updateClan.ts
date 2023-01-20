import { fraction, round } from 'mathjs';
import config from '../config/config';
import Clan from '../database/models/Clan.model';
import ClanMember from '../database/models/ClanMember.model';
import log from '../utils/log';

export const updateClan = async (clan: Clan): Promise<void> => {
  try {
    const req = await fetch(`https://api.clashofclans.com/v1/clans/%23${clan.tag}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${config.get('clashOfClans.apiKey')}`,
      },
    });
    const res = await req.json();

    await clan.update({
      tag: res.tag.replace('#', ''),
      name: res.name,
      type: res.type,
      description: res.description,
      location: res.location.name,
      badgeUrls: res.badgeUrls,
      clanLevel: res.clanLevel,
      clanPoints: res.clanPoints,
      clanVersusPoints: res.clanVersusPoints,
      requiredTrophies: res.requiredTrophies,
      warFrequency: res.warFrequency,
      warWinStreak: res.warWinStreak,
      warWins: res.warWins,
      warTies: res.warTies,
      warLosses: res.warLosses,
      isWarLogPublic: res.isWarLogPublic,
      memberCount: res.members,
      labels: res.labels,
      requiredVersusTrophies: res.requiredVersusTrophies,
      requiredTownhallLevel: res.requiredTownhallLevel,
      clanCapital: res.clanCapital,
      chatLanguage: res.chatLanguage,
    });

    log.info(`Updated clan info for ${clan.name}`);

    /**
     * Update clan members status to reflect info from API
     */
    const formerMembers = await clan.members.filter((member) => !res.memberList.find((m: any) => m.tag.replace('#', '') === member.tag));
    for (const formerMember of formerMembers) await formerMember.update({ role: 'Former Member' });

    /**
     * Update clan members data to reflect info from API
     */
    for (const member of res.memberList) {
      /**
       * War preference is not in the first api call, so we need to make an api call to the players endpoint
       */
      const playerReq = await fetch(`https://api.clashofclans.com/v1/players/%23${member.tag.replace('#', '')}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          authorization: `Bearer ${config.get('clashOfClans.apiKey')}`,
        },
      });
      const playerRes = await playerReq.json();

      const [existingMember, noMemberExists] = await ClanMember.findOrCreate({
        where: { tag: member.tag.replace('#', '') },
        defaults: {
          clanId: clan.id,
          tag: member.tag.replace('#', ''),
          name: member.name,
          role: translateRole(member.role),
          expLevel: member.expLevel,
          league: member.league,
          trophies: member.trophies,
          versusTrophies: member.versusTrophies,
          donations: member.donations,
          donationsReceived: member.donationsReceived,
          donationsRatio: calculateDonationsRatio(member.donations, member.donationsReceived),
          warPreference: playerRes.warPreference,
        } as ClanMember,
      });

      if (!noMemberExists) {
        await existingMember.update({
          clanId: clan.id,
          tag: member.tag.replace('#', ''),
          name: member.name,
          role: translateRole(member.role),
          expLevel: member.expLevel,
          league: member.league,
          trophies: member.trophies,
          versusTrophies: member.versusTrophies,
          donations: member.donations,
          donationsReceived: member.donationsReceived,
          donationsRatio: calculateDonationsRatio(member.donations, member.donationsReceived),
          warPreference: playerRes.warPreference,
        });
      }
    }

    log.info(`Updated clan members for ${clan.name}`);

    return void 0;
  } catch (err) {
    log.error(`Error updating clan info for ${clan.name}`, err);
    return void 0;
  }
};

const calculateDonationsRatio = (donations: number, donationsReceived: number): string => {
  let donationsRatio;
  if (donationsReceived === 0 && donations === 0) donationsRatio = '0';
  if (donationsReceived === 0 && donations !== 0) donationsRatio = 'Infinity';
  if (donationsReceived !== 0 && donations === 0) donationsRatio = '0';
  if (donationsReceived !== 0 && donations !== 0)
    donationsRatio = `${round(fraction(donations, donationsReceived)).n}:${round(fraction(donations, donationsReceived)).d}`;
  return donationsRatio as string;
};

const translateRole = (role: string): ClanMember['role'] => {
  switch (role) {
    case 'member':
      return 'Member';
    case 'admin':
      return 'Elder';
    case 'coLeader':
      return 'Co-Leader';
    case 'leader':
      return 'Leader';
    default:
      return 'Member';
  }
};
