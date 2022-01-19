import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (Interaction) => void;
}
