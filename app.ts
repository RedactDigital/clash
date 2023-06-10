require('dotenv').config();
// import { CronJob } from 'cron';
// import { processClanData } from './app/processClanData';
// import { Discord } from './app/utils/discord';
// import schedule from './app/utils/schedule';
import log from './app/utils/log';
import config from './app/config/config';

log.info(`Starting clash of clans app on ${config.get('env')} environment`);

// const job = new CronJob(schedule.everyFiveMinutes, processClanData);

// new Discord(true);

// job.start();

log.info(process.env.DATABASE_USER);
