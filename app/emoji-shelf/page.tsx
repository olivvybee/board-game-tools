'use client';

import _fill from 'lodash/fill';
import _range from 'lodash/range';
import _flattenDeep from 'lodash/flattenDeep';
import _cloneDeep from 'lodash/cloneDeep';
import { useLocalStorage } from 'usehooks-ts';

import { generateShelf } from './generateShelf';
import styles from './emoji-shelf.module.css';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

const buildEmptyEmojis = (width: number, height: number) =>
  _range(width).map(() => _range(height).map(() => ''));

const EmojiShelfPage = () => {
  const [width, setWidth] = useLocalStorage('emoji-shelf-width', 5);
  const [height, setHeight] = useLocalStorage('emoji-shelf-height', 5);
  const [fontSize, setFontSize] = useLocalStorage('emoji-shelf-font-size', 18);
  const [emojis, setEmojis] = useLocalStorage<string[][]>(
    'emoji-shelf-emojis',
    buildEmptyEmojis(width, height)
  );

  const setEmoji = (emoji: string, x: number, y: number) => {
    const newEmojis = [...emojis];
    newEmojis[y][x] = emoji;
    setEmojis(newEmojis);
  };

  const addRow = () => {
    const newRow = _fill(Array(width), '');
    const newEmojis = [...emojis, newRow];

    setEmojis(newEmojis);
    setHeight(height + 1);
  };

  const removeRow = () => {
    setHeight(height - 1);
  };

  const addColumn = () => {
    const newEmojis = [...emojis];
    for (let y = 0; y < height; y++) {
      newEmojis[y].push('');
    }
    setWidth(width + 1);
    setEmojis(newEmojis);
  };

  const removeColumn = () => {
    setWidth(width - 1);
  };

  const shelf = generateShelf({
    width,
    height,
    emojis,
    fontSize,
  });

  return (
    <>
      <h1>Emoji shelf builder</h1>

      <p>
        An easy way to generate a shelf for{' '}
        <a href="https://boardgamegeek.com/geeklist/344710/solitaire-games-on-your-table-november-2024">
          SGOYT November 2024
        </a>
        . Simply choose the size of your shelf, enter an emoji into each
        section, and copy the BGG code generated below.
      </p>

      <p>
        If you use the same device each time you want to update your shelf, the
        previous layout of your shelf will be saved when you come back.
      </p>

      <div>
        <button disabled={height >= 10} onClick={addRow}>
          Add row
        </button>
        <button disabled={height <= 1} onClick={removeRow}>
          Remove row
        </button>
        <button disabled={width >= 10} onClick={addColumn}>
          Add column
        </button>
        <button disabled={width <= 1} onClick={removeColumn}>
          Remove column
        </button>
      </div>

      <div
        className={styles.builder}
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(48px, 100px))`,
        }}>
        {_range(height).map((y) =>
          _range(width).map((x) => (
            <input
              key={`${x}-${y}`}
              className={styles.input}
              type="text"
              value={emojis[y][x]}
              onChange={(e) => setEmoji(e.target.value, x, y)}
            />
          ))
        )}
      </div>

      <CopyToClipboardButton value={shelf} text="Copy BGG code to clipboard" />

      <textarea
        className={styles.output}
        style={{ height: `${height * 3 * 16}px` }}
        value={shelf.trim()}
        onFocus={(e) => e.target.select()}
      />
    </>
  );
};

export default EmojiShelfPage;
