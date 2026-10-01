import _uniq from 'lodash/uniq';
import { BGGClient } from '@/data-sources/bgg/client';
import { SolotoberDay } from './types';

export const fetchGameImages = async (
  client: BGGClient,
  days: SolotoberDay[],
) => {
  const gameIds = _uniq(days.map((data) => data.gameId));
  const gameData = await client.games({ gameIds });

  return gameData.reduce(
    (processed, game) => {
      const thumbnailUrl = game.thumbnail;
      const match = thumbnailUrl.match(/pic(\d+)\.(png|jpg)/);
      if (match) {
        processed[game.id] = match[1];
      }
      return processed;
    },
    {} as Record<number, string>,
  );
};
