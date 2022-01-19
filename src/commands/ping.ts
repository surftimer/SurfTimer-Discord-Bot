import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await cmdCallback(interaction);
  },
};

async function cmdCallback(interaction: CommandInteraction): Promise<void> {
  return interaction.reply('Pong!');
}
