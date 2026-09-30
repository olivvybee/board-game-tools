import { Play } from '../entities/Play';

export interface PlaysResponse {
  plays: {
    play: Play[];
    total: number;
  };
}
