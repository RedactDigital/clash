import { CronJob } from 'cron';
import type { CronCommand } from 'cron';
import type { Client } from 'discord.js';
import { Events } from 'discord.js';
import { cronUtil } from '../utils/cronUtil';
import { processClanData } from '../processClanData';
import { config } from '../config/index.config';
import log from '../utils/log';

export const clientReadyEvent = (client: Client): void => {
  client.once(Events.ClientReady, () => {
    log.info(`${config.get('app.name')} discord client is ready`);

    const job = new CronJob(cronUtil.everyFiveMinutes, <CronCommand>(<unknown>processClanData(client)), null, true, 'America/New_York');
    job.start();
  });
};
