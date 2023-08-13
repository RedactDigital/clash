/* eslint-disable max-lines */
// eslint-disable-next-line import/named
import { fraction, round } from 'mathjs';
import { config } from './config/index.config';
import type Clan from './database/models/Clan.model';
import type { PlayerHouse, PlayerVillage, WarPreference } from './database/models/ClanMember.model';
import ClanMember, { Role } from './database/models/ClanMember.model';
import log from './utils/log';

enum WarFrequency {
  UNKNOWN = 'UNKNOWN',
  ALWAYS = 'ALWAYS',
  MORE_THAN_ONCE_PER_WEEK = 'MORE_THAN_ONCE_PER_WEEK',
  ONCE_PER_WEEK = 'ONCE_PER_WEEK',
  LESS_THAN_ONCE_PER_WEEK = 'LESS_THAN_ONCE_PER_WEEK',
  NEVER = 'NEVER',
  ANY = 'ANY',
}

enum ClanType {
  OPEN = 'OPEN',
  INVITE_ONLY = 'INVITE_ONLY',
  CLOSED = 'CLOSED',
}

interface League {
  id: number;
  name: string;
  iconUrls?: {
    small: string;
    tiny: string;
    medium: string;
  };
}

interface ClanMemberResponse {
  league: League;
  builderBaseLeague: League;
  versusTrophies: number;
  tag: string;
  name: string;
  role: Role;
  expLevel: number;
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  trophies: number;
  builderBaseTrophies: number;
  playerHouse: {
    elements: Array<{
      id: number;
      type: Array<PlayerHouse>;
    }>;
  };
}

interface LegendLeagueTournamentSeasonResult {
  id: string;
  rank: number;
  trophies: number;
}

interface PlayerItemLevel {
  level: number;
  name: string;
  maxLevel: number;
  village: PlayerVillage;
  superTroopIsActive: boolean;
}

interface Label {
  id: number;
  name: string;
  iconUrls: Array<{
    small: string;
    tiny: string;
    medium: string;
  }>;
}

interface ClanResponse {
  warLeague: League;
  capitalLeague: League;
  memberList: Array<ClanMemberResponse>;
  tag: string;
  isWarLogPublic: boolean;
  warFrequency: WarFrequency;
  clanLevel: number;
  warWinStreak: number;
  warWins: number;
  warTies: number;
  warLosses: number;
  clanPoints: number;
  requiredTownhallLevel: number;
  chatLanguage: {
    id: number;
    name: string;
    languageCode: string;
  };
  isFamilyFriendly: boolean;
  clanBuilderBasePoints: number;
  clanVersusPoints: number;
  clanCapitalPoints: number;
  requiredTrophies: number;
  requiredBuilderBaseTrophies: number;
  requiredVersusTrophies: number;
  name: string;
  location: {
    localizedName: string;
    id: number;
    name: string;
    isCountry: boolean;
    countryCode: string;
  };
  type: ClanType;
  members: number;
  labels: Array<Label>;
  description: string;
  clanCapital: {
    capitalHallLevel: number;
    districts: Array<{
      name: string;
      id: number;
      districtHallLevel: number;
    }>;
  };
  badgeUrls: Array<string>;
}

interface PlayerResponse {
  league: League;
  builderBaseLeague: League;
  clan: {
    tag: string;
    name: string;
    clanLevel: number;
    badgeUrls: {
      small: string;
      tiny: string;
      medium: string;
    };
  };
  role: Role;
  warPreference: WarPreference;
  attackWins: number;
  defenseWins: number;
  versusTrophies: number;
  bestVersusTrophies: number;
  townHallLevel: number;
  townHallWeaponLevel: number;
  versusBattleWins: number;
  legendStatistics: {
    legendTrophies: number;
    currentSeason: LegendLeagueTournamentSeasonResult;
    previousBuilderBaseSeason: LegendLeagueTournamentSeasonResult;
    bestSeason: LegendLeagueTournamentSeasonResult;
    previousVersusSeason: LegendLeagueTournamentSeasonResult;
    bestBuilderBaseSeason: LegendLeagueTournamentSeasonResult;
    bestVersusSeason: LegendLeagueTournamentSeasonResult;
    previousSeason: LegendLeagueTournamentSeasonResult;
  };
  troops: PlayerItemLevel;
  heroes: PlayerItemLevel;
  spells: PlayerItemLevel;
  labels: Array<Label>;
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  donations: number;
  donationsReceived: number;
  builderHallLevel: number;
  builderBaseTrophies: number;
  bestBuilderBaseTrophies: number;
  warStars: number;
  achievements: Array<{
    stars: number;
    value: number;
    target: number;
    info: string;
    name: string;
    completionInfo: string;
    village: PlayerVillage;
  }>;
  clanCapitalContributions: number;
  playerHouse: {
    elements: Array<{
      id: number;
      type: Array<PlayerHouse>;
    }>;
  };
}

export const updateClan = async (clan: Clan): Promise<void> => {
  try {
    const req = await fetch(`https://api.clashofclans.com/v1/clans/%23${clan.tag}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${config.get('clashOfClans.apiKey')}`,
      },
    });
    const res = <ClanResponse>await req.json();

    await clan.update({
      tag: res.tag.replace('#', ''),
      name: res.name,
      type: res.type,
      description: res.description,
      location: JSON.stringify(res.location),
      badgeUrls: JSON.stringify(res.badgeUrls),
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
      memberCount: Number(res.members),
      labels: JSON.stringify(res.labels),
      requiredVersusTrophies: res.requiredVersusTrophies,
      requiredTownhallLevel: res.requiredTownhallLevel,
      clanCapital: JSON.stringify(res.clanCapital),
      chatLanguage: JSON.stringify(res.chatLanguage),
    });

    /**
     * Update clan members status to reflect info from API
     */
    const formerMembers = clan.members.filter((member) => !res.memberList.find((m: ClanMemberResponse) => m.tag.replace('#', '') === member.tag));
    for (const formerMember of formerMembers) await formerMember.update({ role: Role.NOT_MEMBER });

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
      const playerRes = <PlayerResponse>await playerReq.json();

      const [existingMember, noMemberExists] = await ClanMember.findOrCreate({
        where: { tag: member.tag.replace('#', '') },
        defaults: <ClanMember>{
          clanId: clan.id,
          tag: member.tag.replace('#', ''),
          name: member.name,
          role: translateRole(member.role),
          expLevel: member.expLevel,
          league: JSON.stringify(member.league),
          trophies: member.trophies,
          versusTrophies: member.versusTrophies,
          donations: member.donations,
          donationsReceived: member.donationsReceived,
          donationsRatio: calculateDonationsRatio(member.donations, member.donationsReceived),
          warPreference: playerRes.warPreference,
        },
      });

      if (!noMemberExists) {
        await existingMember.update({
          clanId: clan.id,
          tag: member.tag.replace('#', ''),
          name: member.name,
          role: translateRole(member.role),
          expLevel: member.expLevel,
          league: JSON.stringify(member.league),
          trophies: member.trophies,
          versusTrophies: member.versusTrophies,
          donations: member.donations,
          donationsReceived: member.donationsReceived,
          donationsRatio: calculateDonationsRatio(member.donations, member.donationsReceived),
          warPreference: playerRes.warPreference,
        });
      }
    }

    return void 0;
  } catch (err) {
    log.error(`Error updating clan info for ${clan.name}`, err);
    return void 0;
  }
};

const calculateDonationsRatio = (donations: number, donationsReceived: number): string => {
  let donationsRatio = '';
  if (donationsReceived === 0 && donations === 0) donationsRatio = '0';
  if (donationsReceived === 0 && donations !== 0) donationsRatio = 'Infinity';
  if (donationsReceived !== 0 && donations === 0) donationsRatio = '0';
  if (donationsReceived !== 0 && donations !== 0) {
    donationsRatio = `${round(fraction(donations, donationsReceived)).n}:${round(fraction(donations, donationsReceived)).d}`;
  }
  return donationsRatio;
};

const translateRole = (role: string): Role => {
  switch (role) {
    case 'member':
      return Role.MEMBER;
    case 'admin':
      return Role.ADMIN;
    case 'coLeader':
      return Role.COLEADER;
    case 'leader':
      return Role.LEADER;
    default:
      return Role.NOT_MEMBER;
  }
};
