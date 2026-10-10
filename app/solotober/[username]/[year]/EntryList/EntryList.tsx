'use client';

import { useLocalStorage } from 'usehooks-ts';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';
import { GameImage, SolotoberPlay } from '../types';

import { getMarkupForDay } from './getMarkupForDay';

import styles from './EntryList.module.css';

interface EntryListProps {
  year: number;
  plays: SolotoberPlay[];
  gameImages: Record<number, GameImage>;
}

export const EntryList = ({ year, plays, gameImages }: EntryListProps) => {
  const [descriptions, setDescriptions] = useLocalStorage<
    Record<string, string>
  >(`solotober-${year}-descriptions`, {});

  const setDescription = (uniqueId: string, newDescription: string) => {
    setDescriptions({
      ...descriptions,
      [uniqueId]: newDescription,
    });
  };

  return plays.map((play) => {
    const uniqueId = `${play.day}-${play.gameId}`;

    const imageUrl = gameImages[play.gameId].url;
    const description = descriptions[uniqueId] || 'Description goes here';

    const markup = getMarkupForDay(play, gameImages, description);

    return (
      <div className={styles.entry} key={`${play.day}-${play.gameId}`}>
        <p className={styles.entryHeader}>
          <strong>
            {play.day.toString().padStart(2, '0')} -{' '}
            <a href={`https://boardgamegeek.com/thing/${play.gameId}`}>
              {play.gameName}
            </a>
          </strong>

          {play.isNewGame ? ' 🆕' : play.isNewSoloGame ? ' 1️⃣' : ''}
        </p>

        <div className={styles.entryBody}>
          <img className={styles.gameImage} src={imageUrl} />
          <textarea
            className={styles.descriptionBox}
            value={description}
            onChange={(e) => setDescription(uniqueId, e.target.value)}
          />
        </div>

        <CopyToClipboardButton value={markup} text="Copy to clipboard" />
      </div>
    );
  });
};
