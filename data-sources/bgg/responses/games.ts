import { Game } from '../entities/Game';

export interface GamesResponse {
  items: {
    item: Game[];
  };
}
