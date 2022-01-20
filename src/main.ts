import { Client, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { SteamWebApi } from '@j4ckofalltrades/steam-webapi-ts';
import { join } from 'path';

import { regCommands } from './deploy-commands';
import { SlashCommand } from './types';

dotenv.config();

export const steamWebApi = new SteamWebApi(process.env.STEAM_API_KEY);

export const prisma = new PrismaClient();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = new Map<string, SlashCommand>();

console.log('Reading commands...');
readdirSync(join(__dirname, 'commands')).forEach((file) => {
  if (!file.endsWith('.js')) {
    return;
  }
  try {
    const command = require(`./commands/${file}`);
    commands.set(command.default.data.name, command.default);
  } catch (e) {
    console.error(e);
  }
});
console.log('Done reading commands.');
console.log('Registering commands...');
regCommands(Array.from(commands.values()).map((c) => c.data.toJSON()));

client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (command === undefined) {
    return;
  }
  try {
    await command.execute(interaction);
  } catch (e) {
    console.error(e.toString());
    try {
      await interaction.reply({
        content: `There was an error while executing ${interaction}`,
        ephemeral: true,
      });
    } catch (e) {
      console.error(`Error response failed for ${interaction}`);
    }
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
