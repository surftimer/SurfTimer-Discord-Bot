import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import * as dotenv from 'dotenv';
import { prisma, steamWebApi } from '../main';
import { convertToSteam64 } from '../utils/convertToSteam64';

dotenv.config();

export default {
  data: new SlashCommandBuilder()
    .setName('playerstats')
    .setDescription('Gets the stats of a player.')
    .addStringOption((option) =>
      option
        .setName('playerid')
        .setDescription(
          'The steam profile URL of the player, or their Steam ID.',
        )
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    await cmdCallback(interaction);
  },
};

async function cmdCallback(interaction: CommandInteraction): Promise<void> {
  const playerID = interaction.options.getString('playerid');
  const steamID64 = await convertToSteam64(playerID, process.env.STEAM_API_KEY);
  if (steamID64 === undefined) {
    return interaction.reply('Incorrect playerID.');
  }
  const playerInfo = await steamWebApi.usersApi.getPlayerSummaries([steamID64]);
  if (playerInfo.response.players.length === 0) {
    return interaction.reply('Incorrect playerID.');
  }

  const res = await prisma.ck_playerrank.findFirst({
    where: {
      steamid64: steamID64,
    },
    select: {
      points: true,
    },
  });

  const personaname = playerInfo.response.players[0].personaname;

  if (!res) {
    return interaction.reply(
      `${personaname} not found in the SurfTimer database.`,
    );
  }

  const points = res.points;
  return interaction.reply(`${personaname} has ${points} points.`);
}
