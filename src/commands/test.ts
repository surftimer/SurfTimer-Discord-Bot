import { SlashCommandBuilder } from '@discordjs/builders';
import * as dotenv from 'dotenv';

//import { prisma } from '../main';

dotenv.config();

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
