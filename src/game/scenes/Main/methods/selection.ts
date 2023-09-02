import Formation from "../../../entities/Formation/Formation";
import Square from "../../../entities/Square/Square";

export default function selectWithinRadius(
  centerX: number,
  centerY: number,
  radius: number,
  map: Map<string, Square>
) {
  const selection = new Set<Square>();

  const leftX = centerX - radius;
  const rightX = centerX + radius;
  const topY = centerY - radius;
  const bottomY = centerY + radius;

  for (let x = leftX; x <= rightX; x++) {
    for (let y = topY; y <= bottomY; y++) {
      const distanceSquared = (x - centerX) ** 2 + (y - centerY) ** 2;
      if (distanceSquared <= radius * radius) {
        const square = map.get(`${x},${y}`);
        if (square) selection.add(square);
      }
    }
  }

  return selection;
}

export function eraseWithinRadius(
  centerX: number,
  centerY: number,
  radius: number,
  map: Map<string, Square>
) {
  const selection = new Set<Square>();

  // Step 1: Create a set to store squares within the radius.
  const squaresWithinRadius = new Set<Square>();
  const affectedLandmasses = new Set<Formation>();

  // Step 2: Calculate the coordinates of all the cells within the bounding circle.
  const minX = Math.floor(centerX - radius);
  const maxX = Math.ceil(centerX + radius);
  const minY = Math.floor(centerY - radius);
  const maxY = Math.ceil(centerY + radius);

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared <= radius * radius) {
        const square = map.get(`${x},${y}`);
        if (square) {
          if (!affectedLandmasses.has(square.landmass))
            affectedLandmasses.add(square.landmass);
          // Step 3: Add the square to the pre-computed set.
          squaresWithinRadius.add(square);
        }
      }
    }
  }

  // Loop through the pre-computed set and perform the square removal.
  squaresWithinRadius.forEach((square) => square.remove());

  return affectedLandmasses;
}
