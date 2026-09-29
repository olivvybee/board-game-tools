export interface Play {
  id: number;
  date: string;
  quantity: number;
  length: number;
  item: {
    objectid: number;
    name: string;
  };
  players: {
    player: Array<{
      userid: number;
      username: string;
      name: string;
      new: number;
    }>;
  };
}
