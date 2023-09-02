import { Cardinal, Direction, SquarePosition } from "../types";

export function getOppositeSide(cardinal: Cardinal) {
  const oppositeMap: { [key: string]: Cardinal } = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  return oppositeMap[cardinal];
}

export function getOppositeDirection(direction: Direction) {
  const oppositeMap: { [key: string]: Direction } = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  return oppositeMap[direction];
}

export function cardinalToDirection(cardinal: Cardinal): Direction {
  const oppositeMap: { [key: string]: Direction } = {
    top: "up",
    bottom: "down",
    left: "left",
    right: "right",
  };
  return oppositeMap[cardinal];
}

export function directionToCardinal(direction: Direction): Cardinal {
  const oppositeMap: { [key: string]: Cardinal } = {
    up: "top",
    down: "bottom",
    left: "left",
    right: "right",
  };
  return oppositeMap[direction];
}

export function randomPosition(
  rowCount: number,
  colCount: number,
  cellSize: number
) {
  const randX = Math.floor(Math.random() * colCount) * cellSize + cellSize / 2;
  const randY = Math.floor(Math.random() * rowCount) * cellSize + cellSize / 2;
  return { x: randX, y: randY };
}

export function directionToAdjacent(
  direction: Direction,
  row: number,
  col: number
) {
  let newRow = row;
  let newCol = col;

  if (direction === "up") {
    newRow--;
  } else if (direction === "down") {
    newRow++;
  } else if (direction === "left") {
    newCol--;
  } else if (direction === "right") {
    newCol++;
  }

  return { row: newRow, col: newCol };
}

export function cardinalToAdjacent(
  cardinal: Cardinal,
  row: number,
  col: number
) {
  let newRow = row;
  let newCol = col;

  if (cardinal === "top") {
    newRow--;
  } else if (cardinal === "bottom") {
    newRow++;
  } else if (cardinal === "left") {
    newCol--;
  } else if (cardinal === "right") {
    newCol++;
  }

  return { row: newRow, col: newCol };
}

export function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function getAdjacentTiles(
  row: number,
  col: number
): {
  top: { row: number; col: number };
  bottom: { row: number; col: number };
  left: { row: number; col: number };
  right: { row: number; col: number };
} {
  const adjacentTiles = {
    top: { row: row - 1, col },
    bottom: { row: row + 1, col },
    left: { row, col: col - 1 },
    right: { row, col: col + 1 },
  };

  return adjacentTiles;
}

export function directionToAngle(direction: Direction, invert = false): number {
  if (direction === "left") {
    if (invert) return 90;
    else return 270;
  } else if (direction === "right") {
    if (invert) return 270;
    else return 90;
  } else if (direction === "up") {
    if (invert) 180;
    else return 0;
  } else if (direction === "down") {
    if (invert) return 0;
    else return 180;
  }
  return 0;
}

export function isWithinGrace(
  value: number,
  target: number,
  grace: number
): boolean {
  return value > target - grace && value < target + grace;
}

// export function generateRandomColor() {
//   const randomColor = Math.floor(Math.random() * 16777215); // Generate a random number between 0 and 16777215
//   const hexColor = 0x1000000 | randomColor; // Add the leading 1 to ensure the color has all 6 digits
//   return hexColor;
// }

export function generateReliefColor(value: number): string {
  // Calculate the color values
  const red = Math.floor(255 * (1 - value));
  const green = Math.floor(255 * value);
  const blue = 0;

  // Convert the color values to hexadecimal
  const hex = ((red << 16) | (green << 8) | blue).toString(16).padStart(6, "0");

  return `#${hex}`;
}

export function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 0xffffff); // Generate a random number between 0 and 16777215 (0xFFFFFF in decimal)
  const alpha = 0; // Set the desired alpha value

  // Extract the RGB channels from the random color
  const red = (randomColor >> 16) & 0xff;
  const green = (randomColor >> 8) & 0xff;
  const blue = randomColor & 0xff;

  // Calculate the lighter color by interpolating between each RGB channel and 255 (full brightness)
  const lighterRed = Math.floor(red + (255 - red) * alpha);
  const lighterGreen = Math.floor(green + (255 - green) * alpha);
  const lighterBlue = Math.floor(blue + (255 - blue) * alpha);

  // Combine the modified RGB channels to form the lighter color
  const lighterColor = (lighterRed << 16) | (lighterGreen << 8) | lighterBlue;

  return lighterColor;
}

export function isInViewport(
  row: number,
  col: number,
  viewport: {
    startRow: number;
    startCol: number;
    visibleRows: number;
    visibleCols: number;
  }
) {
  return (
    row >= viewport.startRow &&
    row <= viewport.startRow + viewport.visibleRows &&
    col >= viewport.startCol &&
    col <= viewport.startCol + viewport.visibleCols
  );
}

export function is90degrees(
  pos1: SquarePosition,
  pos2: SquarePosition
): boolean {
  switch (pos1) {
    case "TopLeft":
      if (pos2 === "TopRight" || pos2 === "BottomLeft") return true;
      return false;
    case "Top":
      if (pos2 === "Right" || pos2 === "Left") return true;
      return false;
    case "TopRight":
      if (pos2 === "TopLeft" || pos2 === "BottomRight") return true;
      return false;
    case "Right":
      if (pos2 === "Top" || pos2 === "Bottom") return true;
      return false;
    case "BottomRight":
      if (pos2 === "TopRight" || pos2 === "BottomLeft") return true;
      return false;
    case "Bottom":
      if (pos2 === "Left" || pos2 === "Right") return true;
      return false;
    case "BottomLeft":
      if (pos2 === "TopLeft" || pos2 === "BottomRight") return true;
      return false;
    case "Left":
      if (pos2 === "Top" || pos2 === "Bottom") return true;
      return false;
  }
}

export function get90degrees(
  pos: SquarePosition
): [SquarePosition, SquarePosition] {
  switch (pos) {
    case "TopLeft":
      return ["TopRight", "BottomLeft"];
    case "Top":
      return ["Right", "Left"];
    case "TopRight":
      return ["TopLeft", "BottomRight"];
    case "Right":
      return ["Top", "Bottom"];
    case "BottomRight":
      return ["TopRight", "BottomLeft"];
    case "Bottom":
      return ["Left", "Right"];
    case "BottomLeft":
      return ["TopLeft", "BottomRight"];
    case "Left":
      return ["Top", "Bottom"];
  }
}

export function getSteepPositions(pos: SquarePosition): SquarePosition[] {
  switch (pos) {
    case "TopLeft":
      return ["Top", "Left", "TopRight", "BottomLeft"];
    case "Top":
      return ["TopRight", "TopLeft", "Right", "Left"];
    case "TopRight":
      return ["Top", "Right", "TopLeft", "BottomRight"];
    case "Right":
      return ["TopRight", "BottomRight", "Top", "Bottom"];
    case "BottomRight":
      return ["Right", "Bottom", "TopRight", "BottomLeft"];
    case "Bottom":
      return ["BottomLeft", "BottomRight", "Left", "Right"];
    case "BottomLeft":
      return ["Bottom", "Left", "TopLeft", "BottomRight"];
    case "Left":
      return ["TopLeft", "BottomLeft", "Top", "Bottom"];
  }
}

export const randomizeDecimals = (value: number): number => {
  const roundedValue = Math.round(value * 100); // Multiply by 100 to preserve two decimal places
  const randomOffset = Math.random() * 100; // Generate a random offset between 0 and 99
  const randomizedValue = (roundedValue + randomOffset) / 100; // Divide by 100 to restore the original scale

  return randomizedValue;
};

export function oneIn(chance: number): boolean {
  if (!Math.floor(Math.random() * chance)) return true;
  return false;
}

export function random(num: number): number {
  return Math.floor(Math.random() * num);
}

export function numericColorToHex(color: number): string {
  // Ensure the color value is within the valid range (0x000000 to 0xFFFFFF)
  const clampedColor = Math.max(0x000000, Math.min(color, 0xffffff));
  // Convert the numeric color to a hexadecimal string with a leading '0x'
  const hexString = clampedColor.toString(16).padStart(6, "0");
  return `#${hexString}`;
}
