import { CronJob } from 'cron';
import type { Client } from 'discord.js';
import { Events } from 'discord.js';
import { cronUtil } from '../utils/cronUtil';
import { processClanData } from '../processClanData';
import { config } from '../config/index.config';
import log from '../utils/log';

export const clientReadyEvent = (client: Client): void => {
  client.on(Events.ClientReady, async () => {
    log.info(`${config.get('app.name')} discord client is ready`);

    await processClanData(client);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const job = new CronJob(cronUtil.everyFiveMinutes, async () => processClanData(client));
    job.start();
  });
};
