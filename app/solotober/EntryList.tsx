'use client';

import { useLocalStorage } from 'usehooks-ts';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

import { getMarkupForDay } from './addMarkupToGame';
import { GameImage, SolotoberDay } from './types';
import styles from './EntryList.module.css';

interface EntryListProps {
  year: number;
  days: SolotoberDay[];
  gameImages: Record<number, GameImage>;
}

export const EntryList = ({ year, days, gameImages }: EntryListProps) => {
  const [descriptions, setDescriptions] = useLocalStorage<
    Record<string, string>
  >(`solotober-${year}-descriptions`, {});

  const setDescription = (uniqueId: string, newDescription: string) => {
    setDescriptions({
      ...descriptions,
      [uniqueId]: newDescription,
    });
  };

  return days.map((data) => {
    const uniqueId = `${data.day}-${data.gameId}`;

    const imageUrl = gameImages[data.gameId].url;
    const description = descriptions[uniqueId] || 'Description goes here';

    const markup = getMarkupForDay(data, gameImages, description);

    return (
      <div className={styles.entry} key={`${data.day}-${data.gameId}`}>
        <p className={styles.entryHeader}>
          <strong>
            {data.day.toString().padStart(2, '0')} -{' '}
            <a href={`https://boardgamegeek.com/thing/${data.gameId}`}>
              {data.gameName}
            </a>
          </strong>

          {data.isNewGame ? ' 🆕' : data.isNewSoloGame ? ' 1️⃣' : ''}
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
