import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/utc'));
import Clan from '../database/models/Clan.model';
import { Discord } from '../utils/discord';
import log from '../utils/log';
import { updateClan } from './updateClan';
import { updateClanWar } from './updateClanWar';
import { updateMemberScores } from './updateMemberScores';

export const processClanData = async () => {
  try {
    const clans = await Clan.findAll({ include: ['members'] });
    if (!clans) throw new Error('No clans found');

    for (const clan of clans) {
      await updateClan(clan);

      await updateClanWar(clan);

      await updateMemberScores(clan);
    }

    /**
     * Update discord
     */
    new Discord(false);

    return true;
  } catch (error) {
    log.error('Error:', error);
    return false;
  }
};
