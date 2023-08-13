import convict from 'convict';
import { log } from './log.config';
import { database } from './database.config';
import 'dotenv/config';

const config = convict({
  app: {
    env: {
      doc: 'The application environment.',
      format: ['production', 'development', 'test'],
      default: 'development',
      env: 'NODE_ENV',
    },
    name: {
      doc: 'The application name.',
      format: String,
      default: 'Clash of Clans Bot',
      env: 'APP_NAME',
    },
  },
  log,
  database,
  clashOfClans: {
    apiKey: {
      doc: 'The Clash of Clans API key.',
      format: String,
      default: '',
      env: 'CLASH_OF_CLANS_API_KEY',
      sensitive: true,
    },
  },
  discord: {
    token: {
      doc: 'The Discord bot token.',
      format: String,
      default: '',
      env: 'CLASH_OF_CLANS_DISCORD_TOKEN',
      sensitive: true,
    },
  },
});

config.validate({ allowed: 'strict' });

export { config };
