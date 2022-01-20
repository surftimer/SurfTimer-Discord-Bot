import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import * as dotenv from 'dotenv';

import { prisma, MAPS_IMAGES_URL } from '../main';
import { toMMSS } from '../utils/toMMSS';

dotenv.config();

export default {
  data: new SlashCommandBuilder()
    .setName('mapstats')
    .setDescription('Gets the statistics of a map.')
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
  const res1 = await prisma.ck_maptier.findUnique({
    where: {
      mapname: mapname,
    },
    select: {
      tier: true,
    },
  });
  if (res1 === undefined) {
    return interaction.reply(`${mapname} not found.`);
  }

  const averageRunTime = await prisma.ck_playertimes.aggregate({
    _avg: {
      runtimepro: true,
    },
    where: {
      mapname: mapname,
    },
  });

  const averageRunTimeForm = toMMSS(averageRunTime._avg.runtimepro);

  const bestRunTime = await prisma.ck_playertimes.aggregate({
    _min: {
      runtimepro: true,
    },
    where: {
      mapname: mapname,
    },
  });

  const bestRunTimeForm = toMMSS(bestRunTime._min.runtimepro);

  const embed = new MessageEmbed()
    .setTitle(`📈 __Map statistics__ 📈`)
    .setImage(`${MAPS_IMAGES_URL}/${mapname}.jpg`)
    .addFields([
      {
        name: 'Map',
        value: mapname,
        inline: true,
      },
      {
        name: 'Average runtime',
        value: averageRunTimeForm,
        inline: true,
      },
      {
        name: 'Record',
        value: bestRunTimeForm,
        inline: true,
      },
    ]);

  return interaction.reply({ embeds: [embed] });
}
