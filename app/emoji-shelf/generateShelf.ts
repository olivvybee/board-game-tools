import _range from 'lodash/range';
import _repeat from 'lodash/repeat';
import _chunk from 'lodash/chunk';

enum ShelfPiece {
  TopLeftCorner = '╔',
  TopRightCorner = '╗',
  BottomLeftCorner = '╚',
  BottomRightCorner = '╝',

  JunctionTop = '╦',
  JunctionBottom = '╩',
  JunctionLeft = '╠',
  JunctionRight = '╣',
  JunctionCenter = '╬',

  Horizontal = '═',
  Vertical = '║',
}

interface GenerateShelfParams {
  width: number;
  height: number;
  emojis: string[][];
  fontSize: number;
}

export const generateShelf = ({
  width,
  height,
  emojis,
  fontSize,
}: GenerateShelfParams) => {
  const top = generateDivider(width, 'top');
  const divider = generateDivider(width, 'center');
  const bottom = generateDivider(width, 'bottom');

  const rows = _range(height).map((y) => {
    const rowEmojis = emojis[y].slice(0, width);
    return generateRow(rowEmojis);
  });

  const center = rows.join('\n' + divider + '\n');

  const shelf = [top, center, bottom].join('\n');

  return `
[c][size=${fontSize}]
${shelf}[/size][/c]
  `;
};

const generateDivider = (width: number, side: 'top' | 'center' | 'bottom') => {
  let output: string =
    side === 'top'
      ? ShelfPiece.TopLeftCorner
      : side === 'center'
      ? ShelfPiece.JunctionLeft
      : ShelfPiece.BottomLeftCorner;

  output += _range(width)
    .map((_) => _repeat(ShelfPiece.Horizontal, 4))
    .join(
      side === 'top'
        ? ShelfPiece.JunctionTop
        : side === 'center'
        ? ShelfPiece.JunctionCenter
        : ShelfPiece.JunctionBottom
    );

  output +=
    side === 'top'
      ? ShelfPiece.TopRightCorner
      : side === 'center'
      ? ShelfPiece.JunctionRight
      : ShelfPiece.BottomRightCorner;

  return output;
};

const generateRow = (rowEmojis: string[]) =>
  ShelfPiece.Vertical +
  rowEmojis
    .map((emoji) => {
      const text = emoji || '  ';
      return ' ' + text + ' ';
    })
    .join(ShelfPiece.Vertical) +
  ShelfPiece.Vertical;
