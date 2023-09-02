import { random } from "../../../utils/helper-functions";
import Square from "../Square";

export default function spawnIsland(
  this: Square,
  decrease?: () => void
): Square | null {
  const { spread } = this.landmass.islandSettings;
  const { occupiedLand } = this.scene;

  const position = { x: this.x, y: this.y };
  position.x += Math.floor(random(spread) - spread / 2);
  position.y += Math.floor(random(spread) - spread / 2);

  if (!occupiedLand.has(`${position.x},${position.y}`)) {
    const island = new Square(
      this.scene,
      position.y,
      position.x,
      this.elevation,
      this.climate,
      this.landmass,
      this.islandIndex
    );

    if (decrease) decrease();
    return island;
  }
  return null;
}
