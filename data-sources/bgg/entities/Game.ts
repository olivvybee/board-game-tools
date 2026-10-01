export interface Game {
  id: number;
  name: Array<{
    type: string;
    sortindex: string;
    value: string;
  }>;
  image: string;
  thumbnail: string;
}
