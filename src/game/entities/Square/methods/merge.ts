import { oneIn, random } from "../../../utils/helper-functions";
import getAverageColor from "../../GeoMap/land/average";
import Square from "../Square";

export default function merge(
  this: Square,
  amount: number,
  forceColor: number,
  spread: number,
  mergingSet = new Set()
) {
  if (amount === 0) return;
  amount--;
  mergingSet.add(`${this.x},${this.y}`);
  const surroundings = {
    top: { y: this.y - spread, x: this.x },
    right: { y: this.y, x: this.x + spread },
    bottom: { y: this.y + spread, x: this.x },
    left: { y: this.y, x: this.x - spread },
  };

  for (const [_, neighbor] of this.surroundingSquares()) {
    if (mergingSet.has(`${neighbor.x},${neighbor.y}`)) continue;
    if (Math.abs(neighbor.elevation - this.elevation) > 10) continue;

    const color1 = forceColor;
    const color2 = neighbor.color;
    const averageColor = getAverageColor(color1, color2);

    neighbor.climate = this.climate;
    neighbor.climateSet = this.climateSet;
    neighbor.islandIndex = this.islandIndex;

    if (oneIn(5)) {
      const elevation = Math.floor((neighbor.elevation + this.elevation) / 2);
      if (elevation > 12) {
        neighbor.elevation += random(10) - random(10);
        this.elevation += random(10) - random(10);
      }
    }
    const neighbors = [this, neighbor];
    for (const neighbor of neighbors) {
      this.scene.tilemap.placeLandtile(
        neighbor.x,
        neighbor.y,
        neighbor.climate.name,
        neighbor.climateSet,
        neighbor.landmass,
        neighbor.elevation,
        averageColor
      );
    }

    if (oneIn(2)) {
      neighbor.merge(amount, color2, 1, mergingSet);
    }
  }
}
