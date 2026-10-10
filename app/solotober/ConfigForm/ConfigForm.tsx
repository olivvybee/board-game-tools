'use client';

import { SubmitEvent, useState } from 'react';
import { Button } from '@/components/Button';

import styles from './ConfigForm.module.css';
import { useRouter } from 'next/navigation';

export const ConfigForm = () => {
  const router = useRouter();

  const now = new Date();
  const currentYear = now.getFullYear();
  const defaultYear = now.getMonth() >= 9 ? currentYear : currentYear - 1;

  const [username, setUsername] = useState('');
  const [year, setYear] = useState(defaultYear.toString());

  const parsedYear = parseInt(year);
  const isYearValid =
    !isNaN(parsedYear) && parsedYear >= 2000 && parsedYear <= currentYear;

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(`/solotober/${username}/${parsedYear}`);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="username">BGG username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="year">Year</label>
        <input
          id="year"
          type="number"
          min={2000}
          max={currentYear}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={!username || !isYearValid}>
        Generate
      </Button>
    </form>
  );
};
