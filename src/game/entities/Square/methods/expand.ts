import { oneIn, random } from "../../../utils/helper-functions";
import Square from "../Square";

export default function expand(
  this: Square,
  fullExpand?: boolean,
  ignoreSide?: "top" | "left" | "right" | "bottom",
  decrease?: () => void
): boolean {
  //Randomly extends square in four directions.
  //Returns true if succesful
  if (!this.active) return false;
  if (this.expanded && !fullExpand) return false;
  this.expanded = true;
  const { occupiedLand } = this.scene;
  const { terrainDifference } = this.landmass;

  const r = random(terrainDifference);

  let merge = false;
  for (const [side, { x, y }] of Object.entries(this.surroundings).sort(
    () => Math.random() - 0.5
  )) {
    if (side === ignoreSide && oneIn(4)) continue;
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth)
      continue;

    if (fullExpand || oneIn(2)) {
      if (!occupiedLand.has(`${x},${y}`)) {
        let elevation = this.elevation;
        if (r === 1) elevation -= random(2);
        if (r === 2) elevation += random(4);

        if (elevation > 12) {
          elevation += random(10) - random(10);
        }

        if (oneIn(100)) {
          this.climateSet = random(this.climate.colors.length);
          if (this.climateSet < this.climate.colors.length - 1) {
            this.climateSet++;
            if (this.climateSet < this.climate.colors.length - 1 && oneIn(5)) {
              this.climateSet++;
            }
          } else {
            this.climateSet = 0;
          }
        }
        this.clampElevation();

        new Square(
          this.scene,
          y,
          x,
          elevation,
          this.climate,
          this.landmass,
          this.islandIndex,
          this.climateSet
        );
        if (decrease) decrease();
      } else {
        this.convert();

        if (!fullExpand && !this.landmass.squares.has(`${y},${x}`))
          merge = true;
      }
    }
  }
  if (fullExpand && oneIn(50)) merge = true;
  if (merge) this.merge(random(50), this.color, 1);

  return true;
}
