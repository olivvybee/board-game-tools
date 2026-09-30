import { config as loadEnv } from 'dotenv';

import { BGGClient } from '@/data-sources/bgg/client';
import { Play } from '@/data-sources/bgg/entities/Play';

const START_DATE = '2025-10';

const isSoloPlay = (play: Play) =>
  play.players.player.length === 1 ||
  play.players.player.some((player) => player.name.toLowerCase() === 'bot');

const SolotoberPage = async () => {
  loadEnv({ quiet: true });
  const apiKey = process.env.BGG_API_KEY;

  if (!apiKey) {
    throw new Error('BGG_API_KEY environment variable not found');
  }

  const client = new BGGClient(apiKey);
  const plays = await client.plays({ username: 'olivvybee' });

  const previousPlays = plays.filter(
    (play) => new Date(play.date) < new Date(START_DATE),
  );
  const previouslyPlayedGames = new Set(
    previousPlays.map((play) => play.item.objectid),
  );
  const previousSoloGames = new Set(
    previousPlays
      .filter((play) => isSoloPlay(play))
      .map((play) => play.item.objectid),
  );

  const soloPlaysInMonth = plays.filter(
    (play) => play.date.startsWith(START_DATE) && isSoloPlay(play),
  );

  const totalTime = soloPlaysInMonth.reduce(
    (total, play) => (total += play.length),
    0,
  );

  return (
    <div>
      <ul>
        {soloPlaysInMonth
          .toSorted((a, b) => (a.date < b.date ? -1 : 1))
          .map((play) => {
            const isNewGame = !previouslyPlayedGames.has(play.item.objectid);
            const isNewSoloGame = !previousSoloGames.has(play.item.objectid);

            return (
              <li key={play.id}>
                {play.date}: {play.item.name} ({play.length} mins){' '}
                {isNewGame ? '🆕' : isNewSoloGame ? '1️⃣' : null}
              </li>
            );
          })}
      </ul>

      <div>Total time: {totalTime} mins</div>
    </div>
  );
};

export default SolotoberPage;
