import dayjs from 'dayjs';
import type { ColorResolvable } from 'discord.js';

export const clanEvents = {
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
    timeLeft: dayjs(
      dayjs()
        .set('month', dayjs().month() + 1)
        .set('date', 1)
        .hour(8)
        .minute(0),
    ).diff(dayjs(), 'seconds'),
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
    timeLeft: dayjs(
      dayjs()
        .set('month', dayjs().month() + 1)
        .set('date', 22)
        .hour(8)
        .minute(0),
    ).diff(dayjs(), 'seconds'),
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
    timeLeft: dayjs(
      dayjs()
        .set('month', dayjs().month() + 1)
        .set('date', 1)
        .hour(8)
        .minute(0),
    ).diff(dayjs(), 'seconds'),
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
    timeLeft: dayjs(
      dayjs()
        .set('month', dayjs().month() + 1)
        .set('date', 26)
        .hour(5)
        .minute(0),
    ).diff(dayjs(), 'seconds'),
  },
  raidWeekend: {
    name: 'Raid Weekend',
    color: <ColorResolvable>'#FF1717',
    next: dayjs().set('day', 5).hour(3).minute(0).format('MMMM D h:mm A'),
    timeLeft: dayjs(dayjs().set('day', 5).hour(7).minute(0)).diff(dayjs(), 'seconds'),
  },
};
