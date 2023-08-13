import { extend } from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import Clan from './database/models/Clan.model';
import log from './utils/log';
import { updateClan } from './updateClan';
import { updateClanWar } from './updateClanWar';
import { updateMemberScores } from './updateMemberScores';

export const processClanData = async (): Promise<void> => {
  try {
    extend(utcPlugin);

    const clans = await Clan.findAll({ include: ['members'] });

    for (const clan of clans) {
      await updateClan(clan);

      await updateClanWar(clan);

      await updateMemberScores(clan);
    }

    // /**
    //  * Update discord
    //  */
    // new Discord(false);
  } catch (error) {
    log.error('Error:', error);
  }
};
