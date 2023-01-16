require('dotenv').config();
import { CronJob } from 'cron';
import { processClanData } from './app/processClanData';
import { Discord } from './utils/discord';
import log from './utils/log';
import schedule from './utils/schedule';

log.info('Starting cron jobs');

const job = new CronJob(schedule.everyFiveMinutes, processClanData);

new Discord(true);

job.start();
