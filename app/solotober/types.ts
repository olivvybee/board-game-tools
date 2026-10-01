import { Play } from '@/data-sources/bgg/entities/Play';

export type SolotoberDay = {
  day: number;
  gameId: number;
  gameName: string;
  isNewGame: boolean;
  isNewSoloGame: boolean;
  duration: number;
};
