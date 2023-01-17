import { round } from 'mathjs';
import { Op } from 'sequelize';
import Clan from '../database/models/Clan.model';
import ClanMember from '../database/models/ClanMember.model';
import log from '../utils/log';

export const updateMemberScores = async (clan: Clan): Promise<void> => {
  try {
    const members = await ClanMember.findAll({
      where: { clanId: clan.id, role: { [Op.not]: 'Former Member' } },
      include: [
        {
          association: 'warAttacks',
          required: false,
        },
      ],
    });

    if (!members) throw new Error('No members found');

    for (const member of members) {
      const totalAttacks = member.warAttacks.filter((attack) => attack.duration > 0).length;
      const totalWars = member.warAttacks.length;
      const averageAttacks = round(totalAttacks / 2 / totalWars, 2) * 100; // 2 attacks per war
      const totalStars = member.warAttacks.reduce((acc, attack) => acc + attack.stars, 0);
      const averageStars = round(totalStars / 3 / totalWars, 2) * 100; // 3 stars per war
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

      log.info(`Member ${member.name} scores:`, scores);

      const totalScore = round(
        Object.values(scores).reduce((acc, score) => acc + score, 0),
        2,
      );

      await member.update({ score: totalScore, averageAttacks, totalAttacks, totalWars, totalStars, averageStars, averageDestruction });
    }

    log.info(`Updated member scores for clan ${clan.name}`);

    return void 0;
  } catch (err) {
    log.error('Error while updating member scores', err);
    return void 0;
  }
};
