import dayjs from 'dayjs';
import { Client, ColorResolvable, EmbedBuilder, GatewayIntentBits, Message } from 'discord.js';
import { round } from 'mathjs';
import { Op } from 'sequelize';
import config from '../config/config';
import ClanMember from '../database/models/ClanMember.model';
import log from './log';

export class Discord {
  constructor(isApp: boolean) {
    const intents = [
      [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    ];

    const client = new Client({ intents });

    client.on('ready', () => {
      log.info('Discord client ready');

      const channels = {
        rulesChannel: client.channels.cache.get('1013571853266190477'),
        announcementsChannel: client.channels.cache.get('624411630507393045'),
        blacklistChannel: client.channels.cache.get('1046125706251337800'),
      };

      /**
       * Embed the top 25 players in the rules channel who are opted into war
       */
      this._embedTop25(channels.rulesChannel);

      /**
       * Embed typical clash events in the announcements channel
       */
      this._embedEvents(channels.announcementsChannel);
    });

    client.on('messageCreate', async (message) => {
      if (isApp) this._onMessage(message);
    });

    client.on('reconnecting', () => {
      log.info('Discord client reconnecting');
    });

    client.on('disconnect', () => {
      log.info('Discord client disconnected');
    });

    client.on('error', (error) => {
      log.error('Discord error:', error);
    });

    client.login(config.get('discord.token'));
  }

  private async _embedTop25(channel: any) {
    const members = await ClanMember.findAll({ where: { role: { [Op.not]: 'Former Member' }, warPreference: 'in' }, order: [['score', 'DESC']], limit: 25 });

    const membersWithMoreThanOneAttack = members.filter((member) => member.totalAttacks > 0);
    const totalAverageAttacks = membersWithMoreThanOneAttack.reduce((acc, member) => acc + member.averageAttacks, 0);
    const clansAvgAttackRate = round((totalAverageAttacks / membersWithMoreThanOneAttack.length / 100) * 2, 2);

    const top25AverageAttacks = members.reduce((acc, member) => acc + member.averageAttacks, 0);
    const top25AvgAttackRate = round((top25AverageAttacks / members.length / 100) * 2, 2);

    let count = 0;
    const formatFieldData = await members.map((member) => {
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
    await channel.messages.edit('1013572832145440849', { embeds: [embed] });
  }

  private async _embedEvents(channel: any) {
    const secondConversion = (seconds: number) => {
      let day = 86400;
      let hour = 3600;
      // let minute = 60;

      let days = Math.floor(seconds / day);
      let hours = Math.floor((seconds % day) / hour);
      // let minutes = Math.floor((seconds % hour) / minute);

      return `${days} days, ${hours} hours`;
    };

    // Events embed
    const events = {
      CWL: {
        name: 'Clan War League',
        color: '#FF33FC' as ColorResolvable,
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
        color: '#33FFEF' as ColorResolvable,
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
        color: '#FFE433' as ColorResolvable,
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
        color: '#FF9333' as ColorResolvable,
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
        color: '#FF1717' as ColorResolvable,
        next: dayjs().set('day', 5).hour(3).minute(0).format('MMMM D h:mm A'),
        timeLeft: secondConversion(dayjs(dayjs().set('day', 5).hour(7).minute(0)).diff(dayjs(), 'seconds')),
      },
    };

    const CWLEmbed = new EmbedBuilder().setColor(events.CWL.color).setTitle(events.CWL.name).addFields({
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

    // sort embeds by time left
    const sortedEmbeds = [CWLEmbed, clanGamesEmbed, seasonEndEmbed, leagueResetEmbed, raidWeekendEmbed].sort((a, b) => {
      if (!a.data || !b.data) return 0;
      if (!a.data.fields || !b.data.fields) return 0;

      const aTime = a.data.fields[0].value.split(' ')[0];
      const bTime = b.data.fields[0].value.split(' ')[0];

      return parseInt(aTime) - parseInt(bTime);
    });

    await channel.messages.edit('1013939443033452544', {
      embeds: sortedEmbeds,
    });
  }

  private async _onMessage(message: Message) {
    /**
     * Create slash commands
     */
    const acceptedCommands = ['/lineup'];

    const command = message.content.split(' ')[0];
    let content = message.content.split(' ')[1];

    if (!acceptedCommands.includes(command)) return;

    if (command === '/lineup') {
      if (!content) {
        message.reply('Please provide the number of members you want to participate in war.');
        return;
      }

      // find top members by score and sort by trophies
      const topMembers = await ClanMember.findAll({
        where: { role: { [Op.not]: 'Former Member' }, warPreference: 'in', score: { [Op.gt]: 0 } },
        order: [['score', 'DESC']],
        limit: +content,
      });

      /**
       * Find the length of the top members, and if it is less than the number provided, then add the oldest members to the lineup.
       */
      if (topMembers.length < +content) {
        const remainingMembers = await ClanMember.findAll({
          where: { role: { [Op.not]: 'Former Member' }, warPreference: 'in', score: 0, totalWars: 0 },
          order: [['createdAt', 'ASC']],
          limit: +content - topMembers.length,
        });

        remainingMembers.forEach((member) => {
          topMembers.push(member);
        });
      }

      const lineup = await ClanMember.findAll({
        where: { id: topMembers.map((member) => member.id) },
        order: [['trophies', 'DESC']],
      });

      let count = 0;
      const formatData = await lineup.map((member) => {
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

      const embed = new EmbedBuilder()
        .setColor('#6e1701')
        .setTitle('Zero Wars Lineup')
        .setDescription(
          `
        *Last Updated: ${dayjs().format('MMMM D h:mm A')} - UTC*        
        ---
        **Average Attack Rate** - 40%
        **Average Stars** - 35%
        **Average Destruction** - 15%
        **Total Donations This Season** - 10%
        `,
        )
        .addFields(formatData);

      await message.channel.send({ embeds: [embed] });
    }
  }
}
