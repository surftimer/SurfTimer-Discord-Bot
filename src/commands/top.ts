import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  EmbedBuilder,
  InteractionEditReplyOptions,
} from 'discord.js';

import { prisma, steamWebApi } from '../main';

export default {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Gets the top 10 players.'),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    try {
      const reply = await cmdCallback();
      await interaction.editReply(reply);
    } catch (err) {
      console.error(err);
      await interaction.editReply('An internal error occured.');
    }
  },
};

async function cmdCallback(): Promise<InteractionEditReplyOptions | string> {
  const res1 = await prisma.ck_playerrank.findMany({
    orderBy: {
      points: 'desc',
    },
    skip: 0,
    take: 10,
    select: {
      steamid64: true,
      name: true,
      country: true,
      points: true,
    },
  });
  if (!res1) {
    return 'No top players found.';
  }

  const playerInfo = await steamWebApi.usersApi.getPlayerSummaries([
    res1[0].steamid64,
  ]);
  const avatarfull: string =
    playerInfo.response.players.length > 0
      ? playerInfo.response.players[0]['avatarfull']
      : '';

  const fields = res1.map((e, i) => {
    let nb = `🪙 ${i + 1}th`;
    if (i === 0) {
      nb = '🥇 1st';
    } else if (i === 1) {
      nb = '🥈 2nd';
    } else if (i === 2) {
      nb = '🥉 3rd';
    }
    return {
      name: nb,
      value: `[${e.name}](http://steamcommunity.com/profiles/${e.steamid64}) **${e.points}** _pts_`,
      inline: true,
    };
  });

  const embed = new EmbedBuilder()
    .setTitle(`🏆 __Top players__ 🏆`)
    .setThumbnail(avatarfull)
    .addFields(fields);

  return { embeds: [embed] };
}
