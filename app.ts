import { Client } from 'discord.js';
import log from './app/utils/log';
import { intents } from './app/utils/discordIntents';
import { clientReadyEvent } from './app/events/clientReady';
import { errorEvent } from './app/events/error';
import { messageCreateEvent } from './app/events/messageCreate';
import { config } from './app/config/index.config';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  try {
    log.info(`Starting ${config.get('app.name')} on ${config.get('app.env')} environment`);

    const discordClient = new Client({ intents });

    clientReadyEvent(discordClient);

    messageCreateEvent(discordClient);

    errorEvent(discordClient);

    log.info(config.get('discord.token'));

    await discordClient.login(config.get('discord.token'));

    // New Discord(true);
  } catch (error) {
    log.error('Error:', error);
  }
})();
