import { oneIn, random } from "../../../utils/helper-functions";
import Square from "../../Square/Square";
import Formation from "../Formation";
export default function addShoreLine(this: Formation, islandIndex: number) {
  const handled = new Set();
  let randomization = Math.random() * 0.6 - 0.3;
  let relief = Math.max(Math.random() * 0.2, 0.0125);

  const pulse = random(50);
  if (this.scene.pixelScale > 1) return;
  let count = 0;
  for (const square of Array.from(this.landmasses[islandIndex])) {
    square.isBorder = square.surroundingSquares().size !== 4;
  }
  for (const square of Array.from(this.landmasses[islandIndex])) {
    count++;
    if (square.hasShoreline) continue;
    if (square.isBorder) {
      square.hasShoreline = true;
      if (count % pulse === 0) {
        randomization = Math.random() * 0.5 - 0.25;
        relief = Math.max(Math.random() * 0.125, 0.025);
        if (oneIn(20)) randomization = 1;
      }
      const tint =
        square.climate.shoreLine[random(square.climate.shoreLine.length)];
      const alpha = Math.min(0.5 + randomization, 1);
      square.color = this.scene.tilemap.placeLandtile(
        square.x,
        square.y,
        square.climate.name,
        square.climateSet,
        square.landmass,
        square.elevation,
        undefined,
        {
          color: tint,
          amount1: 1 - alpha,
          amount2: alpha,
          // amount1: 1,
          // amount2: 0,
        }
      );
      handled.add(square);
      const extraShore = (square: Square, alpha: number) => {
        if (alpha <= 0) return;
        for (const [side, neighbor] of square.surroundingSquares()) {
          if (handled.has(neighbor)) continue;
          if (oneIn(2)) {
            const tint =
              neighbor.climate.shoreLine[
                random(neighbor.climate.shoreLine.length)
              ];
            neighbor.hasShoreline = true;
            handled.add(neighbor);
            neighbor.color = this.scene.tilemap.placeLandtile(
              neighbor.x,
              neighbor.y,
              neighbor.climate.name,
              neighbor.climateSet,
              neighbor.landmass,
              neighbor.elevation,
              undefined,
              {
                color: tint,
                amount1: 1 - alpha,
                amount2: alpha,
              }
            );
            requestAnimationFrame(() => extraShore(neighbor, alpha - relief));
          }
        }
      };
      if (oneIn(2))
        requestAnimationFrame(() => extraShore(square, alpha - relief));
    }
  }
}
