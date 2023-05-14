import { createLogger, format, transports, addColors } from 'winston';
import path from 'path';
import config from '../config/config';
import DatadogWinston from 'datadog-winston';

const customLevels = {
  levels: {
    info: 3,
    warn: 2,
    error: 1,
    critical: 0,
  },
  colors: {
    info: 'bold cyan',
    warn: 'bold yellow',
    error: 'bold red',
    critical: 'bold white redBG',
  },
};

const consoleFormatter = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.splat(),
  format.printf((info: any) => {
    const { timestamp, level, message, ...meta } = info;

    return `${timestamp} [${level}]: ${message} \n${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  }),
);

const logFormatter = format.combine(
  // Only difference between this and console is color is removed
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.splat(),
  format.printf((info: any) => {
    const { timestamp, level, message, ...meta } = info;

    return `${timestamp} [${level}]: ${message} \n${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  }),
);

addColors(customLevels.colors);

const devLogger = createLogger({
  transports: new transports.Console({
    format: consoleFormatter,
    level: 'info',
  }),
  levels: customLevels.levels,
});

const prodLogger = createLogger({
  level: 'info',
  transports: [
    new transports.File({
      filename: path.join(__dirname, '../storage/logs/info.log'),
      format: logFormatter,
    }),
    new DatadogWinston({
      apiKey: config.get('datadog.apiKey'),
      ddsource: 'nodejs',
      ddtags: `env:${config.get('env')}`,
      service: config.get('api.name'),
      hostname: os.hostname(),
    }),
  ],

  levels: customLevels.levels,
});

let log: any = {};

if (config.get('env') !== 'production') log = devLogger;

if (config.get('env') === 'production') log = prodLogger;

export default log;
