import { config as loadEnv } from 'dotenv';
import _uniq from 'lodash/uniq';

import { BGGClient } from '@/data-sources/bgg/client';
import { Play } from '@/data-sources/bgg/entities/Play';
import { GameImage, SolotoberPlay } from './types';

export const fetchSolotoberData = async (username: string, year: number) => {
  loadEnv({ quiet: true });
  const apiKey = process.env.BGG_API_KEY;

  if (!apiKey) {
    throw new Error('BGG_API_KEY environment variable not found');
  }

  const client = new BGGClient(apiKey);
  const plays = await client.plays({ username });

  const solotoberPlays = filterPlays(plays, year);
  const gameImages = await fetchGameImages(client, solotoberPlays);
  const stats = getStats(solotoberPlays);

  return {
    plays: solotoberPlays,
    gameImages,
    stats,
  };
};

const filterPlays = (plays: Play[], year: number): SolotoberPlay[] => {
  const startDate = new Date(Date.UTC(year, 9, 1));

  const previousPlays = plays.filter((play) => new Date(play.date) < startDate);
  const previouslyPlayedGames = new Set(
    previousPlays.map((play) => play.item.objectid),
  );
  const previousSoloGames = new Set(
    previousPlays
      .filter((play) => isSoloPlay(play))
      .map((play) => play.item.objectid),
  );

  const soloPlaysInMonth = plays.filter(
    (play) => isInSolotoberForYear(play, year) && isSoloPlay(play),
  );

  return soloPlaysInMonth
    .map((play) => {
      const gameId = play.item.objectid;
      const date = new Date(play.date);

      return {
        day: date.getUTCDate(),
        gameId: play.item.objectid,
        gameName: play.item.name,
        duration: play.length,
        isNewGame: !previouslyPlayedGames.has(gameId),
        isNewSoloGame: !previousSoloGames.has(gameId),
      };
    })
    .toSorted((a, b) => b.day - a.day);
};

const isSoloPlay = (play: Play) =>
  play.players.player.length === 1 ||
  play.players.player.some((player) => player.name.toLowerCase() === 'bot');

const isInSolotoberForYear = (play: Play, year: number) => {
  const date = new Date(play.date);
  return date.getUTCFullYear() === year && date.getUTCMonth() === 9;
};

const fetchGameImages = async (client: BGGClient, plays: SolotoberPlay[]) => {
  const gameIds = _uniq(plays.map((play) => play.gameId));
  const gameData = await client.games({ gameIds });

  return gameData.reduce(
    (processed, game) => {
      const thumbnailUrl = game.thumbnail;
      const match = thumbnailUrl.match(/pic(\d+)\.(png|jpg)/);
      if (match) {
        processed[game.id] = {
          id: parseInt(match[1]),
          url: thumbnailUrl,
        };
      }
      return processed;
    },
    {} as Record<number, GameImage>,
  );
};

const getStats = (plays: SolotoberPlay[]) => {
  const daysPlayed = plays.length;
  const gamesPlayed = new Set(plays.map((play) => play.gameId)).size;
  const newGames = plays.filter((play) => play.isNewGame).length;
  const newSoloGames = plays.filter(
    (play) => !play.isNewGame && play.isNewSoloGame,
  ).length;

  const totalTime = plays.reduce((total, play) => total + play.duration, 0);
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  const markup = `
Days played: ${daysPlayed} ${daysPlayed === 31 ? '🎉' : ''}
Different games played: ${gamesPlayed} ${gamesPlayed === 31 ? '🎉' : ''}
New-to-me games: ${newGames}
New-to-me-solo games: ${newSoloGames}
Total time spent playing: ${hours}h ${minutes}m
  `.trim();

  return {
    daysPlayed,
    gamesPlayed,
    newGames,
    newSoloGames,
    time: `${hours}h ${minutes}m`,
    markup,
  };
};
