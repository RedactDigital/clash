// eslint-disable-next-line import/named
import { round } from 'mathjs';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
import type Clan from './database/models/Clan.model';
import ClanMember from './database/models/ClanMember.model';
import ClanWar from './database/models/ClanWar.model';
import log from './utils/log';

export const updateMemberScores = async (clan: Clan): Promise<void> => {
  try {
    /**
     * Get the clan war id for the current war so we can exclude it from the score
     */
    const clanWar = await ClanWar.findOne({
      where: { clanId: clan.id, state: ['preparation', 'inWar'] },
    });
    if (!clanWar) throw new Error('No clan war found');

    const query = <
      {
        clanWarId: { [Op.not]: number };
        createdAt: { [Op.gte]: Date };
      }
    >{
      createdAt: { [Op.gte]: dayjs('01 April 2023').toDate() },
      clanWarId: { [Op.not]: clanWar.id },
    };

    const members = await ClanMember.findAll({
      where: { clanId: clan.id, role: { [Op.not]: 'Former Member' } },
      include: [
        {
          association: 'warAttacks',
          where: query,
          required: false,
        },
      ],
    });

    if (!members.length) throw new Error('No members found');

    for (const member of members) {
      const totalAttacks = member.warAttacks.filter((attack) => attack.duration > 0).length;
      const totalWars = member.warAttacks.length ? member.warAttacks.length / 2 : 0;
      /** Two attacks per war */
      const averageAttacks = round(totalAttacks / 2 / totalWars, 2) * 100;
      const totalStars = member.warAttacks.reduce((acc, attack) => acc + attack.stars, 0);
      /** 6 stars per war */
      const averageStars = round(totalStars / 6 / totalWars, 2) * 100;
      const averageDestruction = round(member.warAttacks.reduce((acc, attack) => acc + attack.destructionPercentage, 0) / totalAttacks, 2);

      const weights = {
        attacks: 0.6,
        stars: 0.3,
        destruction: 0.1,
        donations: 0,
      };

      const scores = {
        averageAttack: 0,
        averageStars: 0,
        averageDestruction: 0,
        donations: 0,
      };

      if (averageAttacks > 0) scores.averageAttack = averageAttacks * weights.attacks;
      if (averageStars > 0) scores.averageStars = averageStars * weights.stars;
      if (averageDestruction > 0) scores.averageDestruction = averageDestruction * weights.destruction;
      if (member.donations > 0) scores.donations = member.donations * weights.donations;

      const totalScore = round(
        Object.values(scores).reduce((acc, score) => acc + score, 0),
        2,
      );

      await member.update({ score: totalScore, averageAttacks, totalAttacks, totalWars, totalStars, averageStars, averageDestruction });
    }

    return void 0;
  } catch (err) {
    log.error('Error while updating member scores', err);
    return void 0;
  }
};
