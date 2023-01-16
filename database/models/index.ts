import { Sequelize, Options, Dialect } from 'sequelize';
import config from '../../config/config';

let sequelizeConfig: Options = {
  username: config.get('database.user'),
  password: config.get('database.password'),
  database: config.get('database.name'),
  host: config.get('database.host'),
  port: config.get('database.port'),
  dialect: 'mysql',
  logging: false,
};

const sequelize = new Sequelize(sequelizeConfig);

export { sequelize, Sequelize };
