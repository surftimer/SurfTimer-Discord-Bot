import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import * as dotenv from 'dotenv';

import { prisma } from '../main';

dotenv.config();

export default {
  data: new SlashCommandBuilder()
    .setName('maptier')
    .setDescription('Gets the tier of a map')
    .addStringOption((option) =>
      option
        .setName('mapname')
        .setDescription('The name of the map')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    await cmdCallback(interaction);
  },
};

async function cmdCallback(interaction: CommandInteraction): Promise<void> {
  const mapname = interaction.options.getString('mapname');
  const res = await prisma.ck_maptier.findUnique({
    where: {
      mapname: mapname,
    },
    select: {
      tier: true,
    },
  });
  if (res === undefined) {
    return interaction.reply(`${mapname} not found.`);
  }
  return interaction.reply(`${mapname} has a tier of ${res.tier}.`);
}
