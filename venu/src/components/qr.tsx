import { h } from "preact";

function cellsFor(value: string, size = 13): boolean[][] {
  let seed = 0;
  for (let i = 0; i < value.length; i++) {
    seed = (seed * 33 + value.charCodeAt(i)) >>> 0;
  }
  const cells = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      cells[y][x] = seed % 3 !== 0;
    }
  }
  const stamp = (ox: number, oy: number) => {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        cells[oy + y][ox + x] = x === 0 || y === 0 || x === 3 || y === 3 || (x === 1 && y === 1);
      }
    }
  };
  stamp(0, 0);
  stamp(size - 4, 0);
  stamp(0, size - 4);
  return cells;
}

type Props = {
  value: string;
  label?: string;
};

export function QrMark({ value, label }: Props) {
  const cells = cellsFor(value);
  const size = cells.length;
  return (
    <div class="venu-qr" role="img" aria-label={label || `Code for ${value}`}>
      <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={size} height={size} fill="#fff" />
        {cells.map((row, y) =>
          row.map((on, x) =>
            on ? <rect x={x} y={y} width="1" height="1" fill="#161513" /> : null
          )
        )}
      </svg>
    </div>
  );
}
