import { Cardinal } from "../../../types";
import { oneIn } from "../../../utils/helper-functions";
import Square from "../Square";

export default function formRiver(
  this: Square,
  exclude: Set<Square> = new Set(),
  forceLength?: number
) {
  //TODO Move to landmass methods
  if (!this.active) return;
  this.landmass.carvingRivers.add(this);
  const calculateDistance = (x: number, y: number) => {
    const { x: originX, y: originY } = this.landmass.origin;
    const distance = Math.sqrt(
      Math.pow(x - originX, 2) + Math.pow(y - originY, 2)
    );

    return distance;
  };

  let shortest = Infinity;
  let prefers: Cardinal;
  for (const [side, { x, y }] of Object.entries(this.surroundings)) {
    const distance = calculateDistance(x, y);
    if (distance < shortest) {
      shortest = distance;
      prefers = side as Cardinal;
    }
  }

  let flowAmount = Math.floor(Math.random() * 50);
  if (oneIn(20)) {
    //Once in a while, huge river
    let maxRiverLength = 500;
    if (oneIn(50)) maxRiverLength += 500;

    flowAmount = Math.floor(Math.random() * maxRiverLength);
  }

  if (forceLength) flowAmount = forceLength;

  const riverFlow = (surroundings: Map<string, Square>): void => {
    for (const [side, neighbor] of surroundings) {
      if (flowAmount <= 0) break;
      if (side !== prefers && oneIn(5)) continue;
      if (exclude.has(neighbor)) continue;

      if (oneIn(75)) neighbor.formRiver(exclude); // Fork river
      if (oneIn(25)) neighbor.subtract(2, 3); // Widen river

      this.scene.tilemap.land.removeTileAt(neighbor.x, neighbor.y);
      const surroundingSquares = neighbor.surroundingSquares();
      neighbor.active = false;
      neighbor.remove();

      flowAmount--;
      requestAnimationFrame(() => riverFlow(surroundingSquares));
      return;
    }
    setTimeout(() => {
      this.landmass.carvingRivers.delete(this);
      if (this.landmass.carvingRivers.size === 0) {
        this.landmass.addShoreLine(this.islandIndex);
      }
    }, 0);
  };
  requestAnimationFrame(() => riverFlow(this.surroundingSquares()));
}
