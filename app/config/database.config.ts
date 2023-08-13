export const database = {
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
    env: 'CLASH_OF_CLANS_DATABASE_NAME',
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
};
