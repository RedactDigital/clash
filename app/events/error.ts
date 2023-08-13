import type { Client } from 'discord.js';
import { Events } from 'discord.js';

export const errorEvent = (client: Client): void => {
  client.on(Events.Error, (error) => {
    throw error;
  });
};
