import { BufferResolvable, MessageAttachment, TextChannel } from 'discord.js';
import * as express from 'express';
import { readFileSync } from 'fs';
import nodeHtmlToImage from 'node-html-to-image';

import { client, steamWebApi } from '../main';
import { MapRecordData } from '../types';

export const api = express();

api.use(express.json());

api.post('/record', async (req, res) => {
  const data = req.body as MapRecordData;
  if (data.apiKey !== process.env.API_KEY) {
    res.send(403);
  }

  const playerInfo = await steamWebApi.usersApi.getPlayerSummaries([
    data.steamID64,
  ]);

  if (playerInfo.response.players.length === 0) {
    return res.sendStatus(400);
  }

  const player = playerInfo.response.players[0];

  const channel = client.channels.cache.get(
    process.env.MAP_RECORD_CHANNEL_ID,
  ) as TextChannel;
  const text = readFileSync(
    './templates/map-record-default.html',
    'utf8',
  ).toString();

  nodeHtmlToImage({
    html: text,
    content: {
      playerName: player.personaname,
      mapName: data.mapName,
      avatar: player.avatarfull,
      newTime: data.newTime,
      timeDiff: data.timeDiff,
    },
  }).then((image) => {
    const attachment = new MessageAttachment(
      image as BufferResolvable,
      'record-image.png',
    );

    const content = {
      files: [attachment],
    };
    channel.send(content);
  });
  return res.sendStatus(201);
});
