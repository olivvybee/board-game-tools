import { GameImage, SolotoberDay } from './types';

export const getMarkupForDay = (
  data: SolotoberDay,
  images: Record<number, GameImage>,
  description: string,
) => {
  const { day, gameId, isNewGame, isNewSoloGame } = data;
  const imageId = images[data.gameId].id;

  return `
[b]${day.toString().padStart(2, '0')} - [thing=${gameId}][/thing][/b] ${isNewGame ? '🆕' : isNewSoloGame ? '1️⃣' : ''}
[floatleft][imageid=${imageId || 6452395} square inline][/floatleft]${description}[clear]
`.trim();
};
