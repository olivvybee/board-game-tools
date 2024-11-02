'use client';

import _fill from 'lodash/fill';
import _range from 'lodash/range';
import _flattenDeep from 'lodash/flattenDeep';
import _cloneDeep from 'lodash/cloneDeep';
import { useLocalStorage } from 'usehooks-ts';

import { generateShelf } from './generateShelf';
import styles from './emoji-shelf.module.css';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';
import { Stepper } from '@/components/Stepper';

const buildEmptyEmojis = (width: number, height: number) =>
  _range(width).map(() => _range(height).map(() => ''));

export const EmojiShelfBuilder = () => {
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
    if (emojis.length <= height) {
      const newRow = _fill(Array(width), '');
      const newEmojis = [...emojis, newRow];
      setEmojis(newEmojis);
    }
  };

  const addColumn = () => {
    if (emojis[0].length <= width) {
      const newEmojis = [...emojis];
      for (let y = 0; y < height; y++) {
        newEmojis[y].push('');
      }
      setEmojis(newEmojis);
    }
  };

  const onRowsChange = (newValue: number) => {
    if (newValue > height) {
      addRow();
    }
    setHeight(newValue);
  };

  const onColumnsChange = (newValue: number) => {
    if (newValue > width) {
      addColumn();
    }
    setWidth(newValue);
  };

  const shelf = generateShelf({
    width,
    height,
    emojis,
    fontSize,
  });

  return (
    <>
      <div className={styles.config}>
        <div className={styles.configItem}>
          Rows
          <Stepper value={height} onChange={onRowsChange} min={1} max={10} />
        </div>

        <div className={styles.configItem}>
          Columns
          <Stepper value={width} onChange={onColumnsChange} min={1} max={10} />
        </div>

        <div className={styles.configItem}>
          Font size
          <Stepper value={fontSize} onChange={setFontSize} min={12} max={20} />
        </div>
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

      <div className={styles.result}>
        <CopyToClipboardButton
          value={shelf}
          text="Copy BGG code to clipboard"
        />

        <textarea
          className={styles.output}
          style={{ height: `${height * 3 * 16}px` }}
          value={shelf.trim()}
          onFocus={(e) => e.target.select()}
        />
      </div>
    </>
  );
};
