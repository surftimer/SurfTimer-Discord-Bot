import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as dotenv from 'dotenv';

dotenv.config();

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

export function regCommands(commands) {
  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENTID,
        process.env.GUILDID,
      ),
      { body: commands },
    )
    .then(() => console.log('Done registering commands.'))
    .catch(console.error);
}
