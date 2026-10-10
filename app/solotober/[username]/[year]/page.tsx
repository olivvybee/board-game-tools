import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

import { EntryList } from './EntryList/EntryList';
import { fetchSolotoberData } from './fetchSolotoberData';

import styles from './page.module.css';

const SolotoberResultsPage = async ({
  params,
}: PageProps<'/solotober/[username]/[year]'>) => {
  const { username, year: yearStr } = await params;
  const year = parseInt(yearStr);

  const { plays, stats, gameImages } = await fetchSolotoberData(username, year);

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

      <p className={styles.heading}>Plays</p>

      <EntryList year={year} plays={plays} gameImages={gameImages} />
    </div>
  );
};

export default SolotoberResultsPage;
