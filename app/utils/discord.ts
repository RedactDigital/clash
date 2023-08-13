/* eslint-disable max-lines */
import dayjs from 'dayjs';
import type { ColorResolvable, Guild, TextChannel } from 'discord.js';
import { Client, EmbedBuilder, Events, GatewayIntentBits } from 'discord.js';
import { round } from 'mathjs';
import { Op } from 'sequelize';
import ClanMember from '../database/models/ClanMember.model';
import log from './log';

export class Discord {
  constructor() {
    const intents = [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ];

    const client = new Client({ intents });

    client.once(Events.ClientReady, async () => {
      log.info('Discord client ready');

      const server = await client.guilds.fetch({ guild: '624411630507393024' });

      const channelIds: {
        rulesChannel: string;
        announcementsChannel: string;
        blacklistChannel: string;
      } = {
        rulesChannel: '1013571853266190477',
        announcementsChannel: '624411630507393045',
        blacklistChannel: '1046125706251337800',
      };

      /**
       * Embed the top 25 players in the rules channel who are opted into war
       */
      await this._embedTop25(server, channelIds.rulesChannel);

      /**
       * Embed typical clash events in the announcements channel
       */
      await this._embedEvents(server, channelIds.announcementsChannel);
    });
  }

  private async _embedTop25(guild: Guild, channelId: string): Promise<void> {
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

    const channel = <TextChannel | null>await guild.channels.fetch(channelId);
    if (!channel) throw new Error('Discord channel not found');

    const messages = await channel.messages.fetch();
    const message = messages.get('1013572832145440849');
    if (!message) throw new Error('Discord message not found');
    await message.edit({ embeds: [embed] });
  }

  // eslint-disable-next-line max-lines-per-function
  private async _embedEvents(guild: Guild, channelId: string): Promise<void> {
    const secondConversion = (seconds: number): string => {
      const day = 86400;
      const hour = 3600;
      // Let minute = 60;

      const days = Math.floor(seconds / day);
      const hours = Math.floor((seconds % day) / hour);
      // Let minutes = Math.floor((seconds % hour) / minute);

      return `${days} days, ${hours} hours`;
    };

    // Events embed
    const events = {
      CWL: {
        name: 'Clan War League',
        color: <ColorResolvable>'#FF33FC',
        next: dayjs()
          .set('month', dayjs().month() + 1)
          .set('date', 1)
          .hour(4)
          .minute(0)
          .second(0)
          .format('MMMM D h:mm A'),
        timeLeft: secondConversion(
          dayjs(
            dayjs()
              .set('month', dayjs().month() + 1)
              .set('date', 1)
              .hour(8)
              .minute(0),
          ).diff(dayjs(), 'seconds'),
        ),
      },
      clanGames: {
        name: 'Clan Games',
        color: <ColorResolvable>'#33FFEF',
        next: dayjs()
          .set('month', dayjs().month() + 1)
          .set('date', 22)
          .hour(4)
          .minute(0)
          .format('MMMM D h:mm A'),
        timeLeft: secondConversion(
          dayjs(
            dayjs()
              .set('month', dayjs().month() + 1)
              .set('date', 22)
              .hour(8)
              .minute(0),
          ).diff(dayjs(), 'seconds'),
        ),
      },
      seasonEnd: {
        name: 'Season End',
        color: <ColorResolvable>'#FFE433',
        next: dayjs()
          .set('month', dayjs().month() + 1)
          .set('date', 1)
          .hour(4)
          .minute(0)
          .format('MMMM D h:mm A'),
        timeLeft: secondConversion(
          dayjs(
            dayjs()
              .set('month', dayjs().month() + 1)
              .set('date', 1)
              .hour(8)
              .minute(0),
          ).diff(dayjs(), 'seconds'),
        ),
      },
      leagueReset: {
        name: 'League Reset',
        color: <ColorResolvable>'#FF9333',
        next: dayjs()
          .set('month', dayjs().month() + 1)
          .set('date', 26)
          .hour(1)
          .minute(0)
          .format('MMMM D h:mm A'),
        timeLeft: secondConversion(
          dayjs(
            dayjs()
              .set('month', dayjs().month() + 1)
              .set('date', 26)
              .hour(5)
              .minute(0),
          ).diff(dayjs(), 'seconds'),
        ),
      },
      raidWeekend: {
        name: 'Raid Weekend',
        color: <ColorResolvable>'#FF1717',
        next: dayjs().set('day', 5).hour(3).minute(0).format('MMMM D h:mm A'),
        timeLeft: secondConversion(dayjs(dayjs().set('day', 5).hour(7).minute(0)).diff(dayjs(), 'seconds')),
      },
    };

    const CwlEmbed = new EmbedBuilder().setColor(events.CWL.color).setTitle(events.CWL.name).addFields({
      name: events.CWL.next,
      value: events.CWL.timeLeft,
      inline: true,
    });

    const clanGamesEmbed = new EmbedBuilder().setColor(events.clanGames.color).setTitle(events.clanGames.name).addFields({
      name: events.clanGames.next,
      value: events.clanGames.timeLeft,
      inline: true,
    });

    const seasonEndEmbed = new EmbedBuilder().setColor(events.seasonEnd.color).setTitle(events.seasonEnd.name).addFields({
      name: events.seasonEnd.next,
      value: events.seasonEnd.timeLeft,
      inline: true,
    });

    const leagueResetEmbed = new EmbedBuilder().setColor(events.leagueReset.color).setTitle(events.leagueReset.name).addFields({
      name: events.leagueReset.next,
      value: events.leagueReset.timeLeft,
      inline: true,
    });

    const raidWeekendEmbed = new EmbedBuilder().setColor(events.raidWeekend.color).setTitle(events.raidWeekend.name).addFields({
      name: events.raidWeekend.next,
      value: events.raidWeekend.timeLeft,
      inline: true,
    });

    // Sort embeds by time left
    const sortedEmbeds = [CwlEmbed, clanGamesEmbed, seasonEndEmbed, leagueResetEmbed, raidWeekendEmbed].sort((a, b) => {
      if (!a.data.fields || !b.data.fields) return 0;

      const [aTime] = a.data.fields[0].value.split(' ');
      const [bTime] = b.data.fields[0].value.split(' ');

      return Number(aTime) - Number(bTime);
    });

    const channel = <TextChannel | null>await guild.channels.fetch(channelId);
    if (!channel) throw new Error('Discord channel not found');

    const messages = await channel.messages.fetch();
    const message = messages.get('1013939443033452544');
    if (!message) throw new Error('Discord message not found');
    await message.edit({ embeds: sortedEmbeds });
  }

  // eslint-disable-next-line max-statements
}
