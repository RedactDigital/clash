import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  database: {
    user: {
      doc: 'The database user.',
      format: String,
      default: 'app',
      env: 'DATABASE_USER',
      sensitive: true,
    },
    password: {
      doc: 'The database password.',
      format: String,
      default: 'password',
      env: 'DATABASE_PASSWORD',
      sensitive: true,
    },
    name: {
      doc: 'The database name.',
      format: String,
      default: 'zerowars',
      env: 'DATABASE_NAME',
    },
    port: {
      doc: 'The database port.',
      format: 'port',
      default: 3306,
      env: 'DATABASE_PORT',
      sensitive: true,
    },
    host: {
      doc: 'The database host.',
      format: String,
      env: 'DATABASE_HOST',
      default: 'localhost',
      sensitive: true,
    },
  },
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
      env: 'CLAH_OF_CLANS_DISCORD_TOKEN',
      sensitive: true,
    },
  },
  datadog: {
    apiKey: {
      doc: 'The datadog api key.',
      format: String,
      default: 'key',
      env: 'DATADOG_API_KEY',
      sensitive: true,
    },
  },
});

config.validate({ allowed: 'strict' });

export default config;
