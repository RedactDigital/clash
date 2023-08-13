import type { Client } from 'discord.js';
import { EmbedBuilder, Events } from 'discord.js';
import { Op } from 'sequelize';
import { round } from 'mathjs';
import dayjs from 'dayjs';
import ClanMember from '../database/models/ClanMember.model';

export const messageCreateEvent = (client: Client): void => {
  const acceptedCommands = ['/lineup'];

  client.on(Events.MessageCreate, async (message) => {
    const [command] = message.content.split(' ');
    const [_, numberOfMembersToInclude] = message.content.split(' ');

    if (!acceptedCommands.includes(command)) return;

    if (command === '/lineup') {
      if (!numberOfMembersToInclude) {
        await message.reply('Please provide the number of members you want to participate in war.');
        return;
      }

      const { topAvgAttackRate, totalAvgAttackRate, formatData } = await createLineup(Number(numberOfMembersToInclude));

      const embed = new EmbedBuilder()
        .setColor('#6e1701')
        .setTitle('Zero Wars Lineup')
        .setDescription(
          `
        *Last Updated: ${dayjs().format('MMMM D h:mm A')} - UTC*
        ---
        **Average Attack Rate** - 60%
        **Average Stars** - 30%
        **Average Destruction** - 10%

        **Top Average Attack Rate** - ${topAvgAttackRate} out of 2 (based on the top players who are have a score greater than 0)
        **Total Average Attack Rate** - ${totalAvgAttackRate} out of 2 (based on all players in the war lineup)
        `,
        )
        .addFields(formatData);

      await message.channel.send({ embeds: [embed] });
    }
  });
};

const createLineup = async (
  numberOfMembersToInclude: number,
): Promise<{
  topAvgAttackRate: number;
  totalAvgAttackRate: number;
  formatData: Array<{
    name: string;
    value: string;
    inline: boolean;
  }>;
}> => {
  const lineup = [];

  // Find top members by score and sort by trophies
  const topMembers = await ClanMember.findAll({
    where: { role: { [Op.not]: 'Former Member' }, warPreference: 'in', score: { [Op.gt]: 0 } },
    order: [['score', 'DESC']],
    limit: numberOfMembersToInclude,
  });

  for (const member of topMembers) lineup.push(member);

  /**
   * Find the length of the top members, and if it is less than the number provided, then add the oldest members to the lineup.
   */
  if (topMembers.length < numberOfMembersToInclude) {
    const remainingMembers = await ClanMember.findAll({
      where: { role: { [Op.not]: 'Former Member' }, warPreference: 'in', score: 0, totalWars: 0 },
      order: [['createdAt', 'ASC']],
      limit: numberOfMembersToInclude - topMembers.length,
    });

    for (const member of remainingMembers) lineup.push(member);
  }

  /**
   * Order the lineup by trophies desc
   */
  const sortedLineup = lineup.sort((a, b) => b.trophies - a.trophies);

  const topAverageAttacks = topMembers.reduce((acc, member) => acc + member.averageAttacks, 0);
  const topAvgAttackRate = round((topAverageAttacks / topMembers.length / 100) * 2, 2);

  const totalAverageAttacks = sortedLineup.reduce((acc, member) => acc + member.averageAttacks, 0);
  const totalAvgAttackRate = round((totalAverageAttacks / sortedLineup.length / 100) * 2, 2);

  let count = 0;
  const formatData = sortedLineup.map((member) => {
    const { name, score, donationsRatio, averageStars, averageDestruction, averageAttacks } = member;
    count++;
    return {
      name: `${count} - ${name}`,
      value: `
            **${score}**: Score
            **${donationsRatio}**: Donations Ratio
            **${round((averageStars / 100) * 3, 2)}**: Avg. Stars per War
            **${averageDestruction}%**: Avg. Destruction per War
            **${round((averageAttacks / 100) * 2, 2)}**: Avg. Attacks per War
            `,
      inline: true,
    };
  });

  return { topAvgAttackRate, totalAvgAttackRate, formatData };
};
