import { config as loadEnv } from 'dotenv';

import { BGGClient } from '@/data-sources/bgg/client';
import { Play } from '@/data-sources/bgg/entities/Play';
import { processPlays } from './processPlays';
import { buildMarkup } from './buildMarkup';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

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

  const markup = buildMarkup(solotoberDays);

  return (
    <div>
      <pre>{markup}</pre>
      <CopyToClipboardButton value={markup} text="Copy BGG code to clipboard" />
    </div>
  );
};

export default SolotoberPage;
