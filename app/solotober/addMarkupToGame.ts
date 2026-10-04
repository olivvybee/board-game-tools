import { GameImage, SolotoberDay } from './types';

export const addMarkupToDay = (
  data: SolotoberDay,
  images: Record<number, GameImage>,
) => {
  const { day, gameId, isNewGame, isNewSoloGame } = data;
  const imageId = images[data.gameId].id;

  const markup = `
[b]${day.toString().padStart(2, '0')} - [thing=${gameId}][/thing][/b] ${isNewGame ? '🆕' : isNewSoloGame ? '1️⃣' : ''}
[floatleft][imageid=${imageId || 6452395} square inline][/floatleft]Description goes here[clear]
`.trim();

  return {
    ...data,
    markup,
  };
};
