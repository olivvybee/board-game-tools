import { SolotoberDay } from './types';

export const buildMarkup = (days: SolotoberDay[]) => {
  const daysMarkup = days
    .map((data) =>
      `
[b]${data.day.toString().padStart(2, '0')} - [thing=${data.gameId}][/thing][/b] ${data.isNewGame ? '🆕' : data.isNewSoloGame ? '1️⃣' : ''}
[floatleft][imageid=6452395 square inline][/floatleft]Description goes here[clear]
`.trim(),
    )
    .join('\n');

  const daysPlayed = days.length;
  const gamesPlayed = new Set(days.map((data) => data.gameId)).size;
  const newGames = days.filter((data) => data.isNewGame).length;
  const newSoloGames = days.filter(
    (data) => !data.isNewGame && data.isNewSoloGame,
  ).length;

  const totalTime = days.reduce((total, data) => total + data.duration, 0);
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  const stats = `
[heading]Stats[/heading]

Days played: ${daysPlayed} ${daysPlayed === 31 ? '🎉' : ''}
Different games played: ${gamesPlayed} ${gamesPlayed === 31 ? '🎉' : ''}
New-to-me games: ${newGames}
New-to-me-solo games: ${newSoloGames}
Total time spent playing: ${hours}h ${minutes}m
  `.trim();

  return daysMarkup + '\n' + stats;
};
