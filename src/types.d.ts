import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (Interaction) => void;
}

export interface MapRecordData {
  apiKey: string;
  steamID64: string;
  mapName: string;
  newTime: string;
  timeDiff: string;
  bonusGroup: number;
  style: number;
}
