# SurfTimer-Discord-Bot

A Discord bot for the Sourcemod [Surftimer](https://github.com/surftimer/Surftimer-Official) plugin.

This bot provides basic commands such as `/playerstats <playerid>`, `/mapstats <mapname>` and `/top`.

The bot can also generate custom images of new records when they are set.

It uses the [discord.js](https://discord.js.org/#/) library and the [prisma ORM](https://www.prisma.io/).

## Examples

### Playerstats Command

![Playerstats Command](https://github.com/Sarrus1/SurfTimer-Discord-Bot/blob/main/examples/playerstats.PNG?raw=true)

### Top Command

![Top Command](https://github.com/Sarrus1/SurfTimer-Discord-Bot/blob/main/examples/top.PNG?raw=true)

### Mapstats Command

![Mapstats Command](https://raw.githubusercontent.com/Sarrus1/SurfTimer-Discord-Bot/main/examples/mapstats.PNG)

### Image generator

![Image generator](https://github.com/Sarrus1/SurfTimer-Discord-Bot/blob/main/examples/test.PNG?raw=true)

## Credits

- A huge thanks to [Sayt123](https://github.com/Sayt123) for their collection of surf map images, without which this bot would not look nearly as good!

## How to use it

### Using Docker (recommended)

1. Install [Docker](https://docs.docker.com/engine/install/ubuntu/).
2. Create a directory called `SurfTimer-Bot` --- `mkdir SurfTimer-Bot`
3. In this directory, create a file named `Dockerfile` --- `nano SurfTimer-Bot/Dockerfile`.
4. In this file, paste the contents of [this file](https://raw.githubusercontent.com/Sarrus1/SurfTimer-Discord-Bot/main/Dockerfile).
5. In the same directory, create a file named `.env` --- `nano SurfTimer-Bot/.env`
6. In this file, paste the contents of [this file](https://raw.githubusercontent.com/Sarrus1/SurfTimer-Discord-Bot/main/env_sample.txt).
7. Edit the environment variables accordingly (follow the URL for a detailed guide).
8. Run the following command to build the Docker image: `docker build SurfTimer-Bot/ -t surftimer-bot`
9. Now run the container with the following command: `docker run -d --env-file=SurfTimer-Bot/.env surftimer-bot`

### Using Node.js

1. Install [Node.js](https://nodejs.dev/download) (v16.13.2 minimum!) and NPM (should be installed with Node).
2. Clone this repository or download its content somewhere.
3. Create a file named `.env`.
4. In this file, paste the contents of [this file](https://raw.githubusercontent.com/Sarrus1/SurfTimer-Discord-Bot/main/env_sample.txt).
5. Edit the environment variables accordingly (follow the URL for a detailed guide).
6. Open a terminal and run `npm i && npm run build`
7. To start the bot, run `npm run start`

### (Optional) Configuring the image generator

1. Install the plugin in `addons/sourcemod/plugins` on your server.
2. Run it once to generate the config file at `cfg/sourcemod/SurfTimer-Discord-Bot.cfg`.
3. In this config file, set your hostname, the port of the API (3000 by default) and the API key you've configured in the previous steps (in your .env file).
4. Reload the plugin and make sure everything is working with the command `!ck_discord_bot_test`.

## Tech Stack

This project uses [TypeScript](https://www.typescriptlang.org/), [Axios](https://axios-http.com/), and the [Prisma ORM](https://www.prisma.io/). It takes advantage of [Discord.js](https://discord.js.org/#/) to interact with the Discord API.

## Contributing

This project has been created for easy collaboration.
You SHOULD use [Visual Studio Code](https://code.visualstudio.com/) to work on this project, as it uses TypeScript and the Prisma ORM, as well as a debugging server, all configured to work with VSCode out of the box.

### Running locally

1. Fork the repository and clone it somewhere on your machine.
2. Make sure [Node.js](https://nodejs.dev/download) (v16.13.2 minimum!) and NPM (should be installed with Node) are installed.
3. Create a file named `.env`.
4. In this file, paste the contents of [this file](https://raw.githubusercontent.com/Sarrus1/SurfTimer-Discord-Bot/main/env_sample.txt).
5. Edit the environment variables accordingly (follow the URL for a detailed guide).
6. Run `npm i` to install the dependencies.
7. Open a terminal in VSCode and type `npm run watch`.
8. Once you want to run the bot, hit _F5_, the bot should start in a debug session.

### Adding commands

The only thing contributors can do is to add new commands (if you have anything in mind, feel free to PR of course). To do so, all you have to do is create a file in the `commands` folder and adapt the code from another command such as `top.ts`.
