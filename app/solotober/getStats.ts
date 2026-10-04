import { SolotoberDay } from './types';

export const getStats = (days: SolotoberDay[]) => {
  const daysPlayed = days.length;
  const gamesPlayed = new Set(days.map((data) => data.gameId)).size;
  const newGames = days.filter((data) => data.isNewGame).length;
  const newSoloGames = days.filter(
    (data) => !data.isNewGame && data.isNewSoloGame,
  ).length;

  const totalTime = days.reduce((total, data) => total + data.duration, 0);
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
