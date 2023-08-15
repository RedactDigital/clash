import { EmbedBuilder } from 'discord.js';
import type { Client, TextChannel } from 'discord.js';
// eslint-disable-next-line import/named
import { round } from 'mathjs';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import Clan from './database/models/Clan.model';
import log from './utils/log';
import { updateClan } from './updateClan';
import { updateClanWar } from './updateClanWar';
import { updateMemberScores } from './updateMemberScores';
import { clanEvents } from './utils/clanEvents';
import ClanMember from './database/models/ClanMember.model';

export const processClanData = async (client: Client): Promise<void> => {
  try {
    log.info('Processing clan data');
    const server = await client.guilds.fetch({ guild: '435261927808172033' });

    const rulesChannel = <TextChannel | null>await server.channels.fetch('1013571853266190477');
    if (!rulesChannel) throw new Error('Rules channel not found');

    const announcementsChannel = <TextChannel | null>await server.channels.fetch('624411630507393045');
    if (!announcementsChannel) throw new Error('Announcement channel not found');

    const clans = await Clan.findAll({ include: ['members'] });

    for (const clan of clans) {
      await updateClan(clan);

      await updateClanWar(clan);

      await updateMemberScores(clan);
    }

    await embedTop25(rulesChannel);
    await embedEvents(announcementsChannel);
  } catch (error) {
    log.error('Error:', error);
  }
};

const embedTop25 = async (channel: TextChannel): Promise<void> => {
  const members = await ClanMember.findAll({ where: { role: { [Op.not]: 'Former Member' }, warPreference: 'in' }, order: [['score', 'DESC']], limit: 25 });

  const membersWithMoreThanOneAttack = members.filter((member) => member.totalAttacks > 0);
  const totalAverageAttacks = membersWithMoreThanOneAttack.reduce((acc, member) => acc + member.averageAttacks, 0);
  const clansAvgAttackRate = round((totalAverageAttacks / membersWithMoreThanOneAttack.length / 100) * 2, 2);

  const top25AverageAttacks = members.reduce((acc, member) => acc + member.averageAttacks, 0);
  const top25AvgAttackRate = round((top25AverageAttacks / members.length / 100) * 2, 2);

  let count = 0;
  const formatFieldData = members.map((member) => {
    count++;
    return {
      name: `${count}. ${member.name}`,
      value: `
            Score: **${member.score}**
            Donation Ratio: **${member.donationsRatio}**
            Avg. Stars: **${round((member.averageStars / 100) * 3, 2)}**
            Avg. Destruction: **${member.averageDestruction}%**
            Avg. Attacks: **${round((member.averageAttacks / 100) * 2, 2)}**
            `,
      inline: true,
    };
  });

  const embed = new EmbedBuilder()
    .setColor('#6e1701')
    .setTitle('Zero Wars Top 25 Scoreboard')
    .setDescription(
      `
        *Last Updated: ${dayjs().format('MMMM D h:mm A')} - UTC*\n
        *If you don't see your name, you are either not opted into war, or you are below the top 25 players.*
        **Breakdown of how the score is weighted:**
        ---
        **Average Attack Rate** - 60%
        **Average Stars** - 30%
        **Average Destruction** - 10%

        **Average Attack Rate** - ${clansAvgAttackRate} out of 2 (based on the top 25 players who are opted into war, and have more than 1 attack)
        **Top 25 Average Attack Rate** - ${top25AvgAttackRate} out of 2 (based on the top 25 players who are opted into war)
        `,
    )
    .addFields(formatFieldData);

  const messages = await channel.messages.fetch();
  const message = messages.get('1013572832145440849');
  if (!message) throw new Error('Discord message not found');
  await message.edit({ embeds: [embed] });
};

const embedEvents = async (channel: TextChannel): Promise<void> => {
  const secondConversion = (seconds: number): string => {
    const day = 86400;
    const hour = 3600;

    const days = Math.floor(seconds / day);
    const hours = Math.floor((seconds % day) / hour);

    return `${days} days, ${hours} hours`;
  };

  const CwlEmbed = new EmbedBuilder()
    .setColor(clanEvents.CWL.color)
    .setTitle(clanEvents.CWL.name)
    .addFields({
      name: clanEvents.CWL.next,
      value: secondConversion(clanEvents.CWL.timeLeft),
      inline: true,
    });

  const clanGamesEmbed = new EmbedBuilder()
    .setColor(clanEvents.clanGames.color)
    .setTitle(clanEvents.clanGames.name)
    .addFields({
      name: clanEvents.clanGames.next,
      value: secondConversion(clanEvents.clanGames.timeLeft),
      inline: true,
    });

  const seasonEndEmbed = new EmbedBuilder()
    .setColor(clanEvents.seasonEnd.color)
    .setTitle(clanEvents.seasonEnd.name)
    .addFields({
      name: clanEvents.seasonEnd.next,
      value: secondConversion(clanEvents.seasonEnd.timeLeft),
      inline: true,
    });

  const leagueResetEmbed = new EmbedBuilder()
    .setColor(clanEvents.leagueReset.color)
    .setTitle(clanEvents.leagueReset.name)
    .addFields({
      name: clanEvents.leagueReset.next,
      value: secondConversion(clanEvents.leagueReset.timeLeft),
      inline: true,
    });

  const raidWeekendEmbed = new EmbedBuilder()
    .setColor(clanEvents.raidWeekend.color)
    .setTitle(clanEvents.raidWeekend.name)
    .addFields({
      name: clanEvents.raidWeekend.next,
      value: secondConversion(clanEvents.raidWeekend.timeLeft),
      inline: true,
    });

  // Sort embeds by time left
  const sortedEmbeds = [CwlEmbed, clanGamesEmbed, seasonEndEmbed, leagueResetEmbed, raidWeekendEmbed].sort((a, b) => {
    if (!a.data.fields || !b.data.fields) return 0;

    const [aTime] = a.data.fields[0].value.split(' ');
    const [bTime] = b.data.fields[0].value.split(' ');

    return Number(aTime) - Number(bTime);
  });

  const messages = await channel.messages.fetch();
  const message = messages.get('1013939443033452544');
  if (!message) throw new Error('Discord message not found');
  await message.edit({ embeds: sortedEmbeds });
};
