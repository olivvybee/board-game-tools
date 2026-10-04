import { config as loadEnv } from 'dotenv';

import { BGGClient } from '@/data-sources/bgg/client';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

import { processPlays } from './processPlays';
import { fetchGameImages } from './fetchGameImages';
import { getMarkupForDay } from './addMarkupToGame';

import styles from './page.module.css';
import { getStats } from './getStats';
import { useLocalStorage } from 'usehooks-ts';
import { EntryList } from './EntryList';

const SolotoberPage = async () => {
  loadEnv({ quiet: true });
  const apiKey = process.env.BGG_API_KEY;

  if (!apiKey) {
    throw new Error('BGG_API_KEY environment variable not found');
  }

  const client = new BGGClient(apiKey);
  const plays = await client.plays({ username: 'olivvybee' });

  const year = new Date().getUTCFullYear();

  const solotoberDays = processPlays(plays, year);

  const gameImages = await fetchGameImages(client, solotoberDays);

  const stats = getStats(solotoberDays);

  return (
    <div>
      <p className={styles.heading}>Stats</p>

      <div className={styles.stats}>
        <p>Days played: {stats.daysPlayed}</p>
        <p>Different games played: {stats.gamesPlayed}</p>
        <p>New-to-me games: {stats.newGames}</p>
        <p>New-to-me-solo games: {stats.newSoloGames}</p>
        <p>Total time spent playing: {stats.time}</p>

        <CopyToClipboardButton value={stats.markup} text="Copy to clipboard" />
      </div>

      <p className={styles.heading}>Daily log</p>

      <EntryList year={year} days={solotoberDays} gameImages={gameImages} />
    </div>
  );
};

export default SolotoberPage;
