import { Play } from '@/data-sources/bgg/entities/Play';
import { SolotoberDay } from './types';

const isSoloPlay = (play: Play) =>
  play.players.player.length === 1 ||
  play.players.player.some((player) => player.name.toLowerCase() === 'bot');

const isInSolotober = (play: Play, year: number) => {
  const date = new Date(play.date);
  return date.getUTCFullYear() === year && date.getUTCMonth() === 9;
};

export const processPlays = (plays: Play[], year: number): SolotoberDay[] => {
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
    (play) => isInSolotober(play, year) && isSoloPlay(play),
  );

  return soloPlaysInMonth.map((play) => {
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
  });
};
