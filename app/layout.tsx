import type { Metadata } from 'next';
import { DM_Mono, DM_Sans } from 'next/font/google';
import classNames from 'classnames';

import './globals.css';
import styles from './layout.module.css';

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--dm-sans',
});
const dmMono = DM_Mono({
  weight: '500',
  subsets: ['latin'],
  variable: '--dm-mono',
});

export const metadata: Metadata = {
  title: 'Board game tools',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={classNames(dmSans.variable, dmMono.variable)}>
      <body>
        <div className={styles.contentWrapper}>{children}</div>
      </body>
    </html>
  );
}
