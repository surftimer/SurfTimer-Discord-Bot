import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  MessageEmbed,
  WebhookMessageOptions,
} from 'discord.js';

import { prisma, MAPS_IMAGES_URL } from '../main';
import { toMMSS } from '../utils/toMMSS';

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
    await interaction.deferReply();
    try {
      const reply = await cmdCallback(interaction);
      await interaction.editReply(reply);
    } catch (err) {
      console.error(err);
      await interaction.editReply('An internal error occured.');
    }
  },
};

async function cmdCallback(
  interaction: CommandInteraction,
): Promise<WebhookMessageOptions | string> {
  const mapname = interaction.options.getString('mapname').toLowerCase();
  const res1 = await prisma.ck_maptier.findUnique({
    where: {
      mapname: mapname,
    },
    select: {
      tier: true,
      maxvelocity: true,
    },
  });
  if (!res1) {
    return `${mapname} not found.`;
  }

  const { tier, maxvelocity } = res1;

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

  const completionsNb = await prisma.ck_playertimes.count({
    where: {
      mapname: mapname,
    },
  });

  const stagesNb = await prisma.ck_zones.count({
    where: {
      mapname: mapname,
      OR: [
        {
          zonetype: {
            equals: 3,
          },
        },
        {
          zonetype: {
            equals: 4,
          },
        },
      ],
    },
  });

  const bonusesNb = await prisma.ck_zones.count({
    where: {
      AND: [
        { mapname: { equals: mapname } },
        {
          OR: [
            {
              zonename: {
                contains: 'bonus',
              },
            },
            {
              zonename: {
                contains: 'BONUS',
              },
            },
          ],
        },
      ],
    },
  });

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
        name: 'Tier',
        value: tier.toString(),
        inline: true,
      },
      {
        name: 'Max velocity',
        value: maxvelocity.toString(),
        inline: true,
      },
      {
        name: 'Number of stages',
        value: stagesNb.toString(),
        inline: true,
      },
      {
        name: 'Number of bonuses',
        value: bonusesNb.toString(),
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
      {
        name: 'Number of completions',
        value: completionsNb.toString(),
        inline: true,
      },
    ]);

  return { embeds: [embed] };
}
