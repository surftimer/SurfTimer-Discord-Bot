import { SlashCommandBuilder } from '@discordjs/builders';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const reply = await cmdCallback();
      await interaction.editReply(reply);
    } catch (err) {
      await interaction.editReply('An internal error occured.');
    }
  },
};

async function cmdCallback(): Promise<string> {
  return 'Pong!';
}
