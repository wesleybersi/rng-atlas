import Square from "../Square";

export default function surroundingSquares(
  this: Square,
  addDiagonals?: boolean
) {
  //Bidirectional
  //Returns a map of <side, Square> if there are squares in a top,left,right,bottom position
  const surroundingSquares = new Map<string, Square>();

  for (const [side, { x, y }] of Object.entries(this.surroundings).sort(
    () => Math.random() - 0.5
  )) {
    const square = this.scene.occupiedLand.get(`${x},${y}`);
    if (square) surroundingSquares.set(side, square);
  }

  if (addDiagonals) {
    //Adds diagonal positions too.
    const positions = {
      topLeft: { x: this.x - 1, y: this.y - 1 },
      topRight: { x: this.x + 1, y: this.y - 1 },
      bottomLeft: { x: this.x - 1, y: this.y + 1 },
      bottomRight: { x: this.x + 1, y: this.y + 1 },
    };
    for (const [side, { x, y }] of Object.entries(positions).sort(
      () => Math.random() - 0.5
    )) {
      const square = this.scene.occupiedLand.get(`${x},${y}`);
      if (square) surroundingSquares.set(side, square);
    }
  }

  return surroundingSquares;
}

export function shuffledSurroundings(this: Square) {
  return Object.values(this.surroundings).sort(() => Math.random() - 0.5);
}

export function emptySurroundings(this: Square) {
  //Returns a map <side, {x, y}> of only the sides that are empty.
  const surroundings = Object.entries(this.surroundings).sort(
    () => Math.random() - 0.5
  );

  const emptySurroundings = new Map<string, { x: number; y: number }>();
  for (const [side, { x, y }] of surroundings) {
    if (y < 0 || x < 0 || y > this.scene.mapHeight || x > this.scene.mapWidth) {
      continue;
    }
    if (!this.scene.occupiedLand.has(`${x},${y}`)) {
      emptySurroundings.set(side, { x, y });
    }
  }
  return emptySurroundings;
}
