import { CronJob } from 'cron';
import type { CronCommand } from 'cron';
import type { Client } from 'discord.js';
import { Events } from 'discord.js';
import { cronUtil } from '../utils/cronUtil';
import { processClanData } from '../processClanData';

export const clientReadyEvent = (client: Client): void => {
  client.once(Events.ClientReady, () => {
    /**
     * Events and Business logic goes here
     */
    const job = new CronJob(cronUtil.everyFiveMinutes, <CronCommand>processClanData, null, true, 'America/New_York');
    job.start();
  });
};
