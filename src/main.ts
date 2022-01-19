import { Client, Intents } from "discord.js";
import * as dotenv from "dotenv";
import { reg } from "./commands/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

reg();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    const map = await prisma.ck_maptier.findUnique({
      where: {
        mapname: "surf_004_fix",
      },
      select: {
        mapname: true,
        tier: true,
      },
    });
    console.dir(map, { depth: null });
    await interaction.reply(map.tier.toString());
  }
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
