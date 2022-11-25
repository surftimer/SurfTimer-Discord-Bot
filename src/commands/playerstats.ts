import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  EmbedBuilder,
  WebhookEditMessageOptions,
} from 'discord.js';
import { prisma, steamWebApi } from '../main';
import { convertToSteam64 } from '../utils/convertToSteam64';

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
): Promise<WebhookEditMessageOptions | string> {
  if (!interaction.isChatInputCommand()) {
    return '';
  }
  const playerID = interaction.options.getString('playerid');
  const steamID64 = await convertToSteam64(playerID, process.env.STEAM_API_KEY);
  if (steamID64 === undefined) {
    return 'Incorrect playerID.';
  }
  const playerInfo = await steamWebApi.usersApi.getPlayerSummaries([steamID64]);
  if (playerInfo.response.players.length === 0) {
    return 'Incorrect playerID.';
  }

  const player = playerInfo.response.players[0];

  const res1 = await prisma.ck_playerrank.findFirst({
    where: {
      steamid64: steamID64,
    },
    select: {
      points: true,
      steamid: true,
    },
  });

  const personaname = player.personaname;
  const avatarfull = player.avatarfull;
  const profileurl = player.profileurl;

  if (!res1) {
    return `${personaname} not found in the SurfTimer database.`;
  }
  const { points, steamid } = res1;

  const rank = await prisma.ck_playerrank.count({
    where: {
      points: {
        gte: points,
      },
      style: {
        equals: 0,
      },
    },
  });

  const totalNbPlayers = await prisma.ck_playerrank.count();

  const finishedMaps = await prisma.ck_playertimes.count({
    where: {
      steamid: steamid,
      style: 0,
    },
  });

  const totalMaps = await prisma.ck_maptier.count();

  const finishedBonuses = await prisma.ck_bonus.count({
    where: {
      steamid: steamid,
      style: 0,
    },
  });

  const totalBonusesQuery: number =
    await prisma.$queryRaw`SELECT DISTINCT COUNT(zonename) as "nb" FROM ck_zones WHERE zonegroup>0`;
  const totalBonuses: number = totalBonusesQuery[0]['nb'];

  const percentMaps = Math.round(
    (finishedMaps / (totalMaps ? totalMaps : 1)) * 100,
  );

  const percentBonuses = Math.round(
    (finishedBonuses / (totalBonuses ? totalBonuses : 1)) * 100,
  );

  const embed = new EmbedBuilder()
    .setTitle(`📈 __Player statistics__ 📈`)
    .setThumbnail(avatarfull)
    .addFields([
      {
        name: 'Player',
        value: `[${personaname}](${profileurl})`,
        inline: true,
      },
      {
        name: 'Completed maps',
        value: `${percentMaps}%`,
        inline: true,
      },
      {
        name: 'Completed bonuses',
        value: `${percentBonuses}%`,
        inline: true,
      },
      { name: 'Rank', value: `${rank + 1}/${totalNbPlayers}`, inline: true },
      { name: 'Score', value: points.toString(), inline: true },
    ]);

  return { embeds: [embed] };
}
