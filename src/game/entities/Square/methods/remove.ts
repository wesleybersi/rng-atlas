import { random } from "../../../utils/helper-functions";
import Square from "../Square";

export default function remove(this: Square) {
  if (!this.scene) return;
  const { tilemap, occupiedLand } = this.scene;

  for (const [_, square] of this.surroundingSquares()) {
    square.elevation += Math.max(random(4), 1);
    square.draw();
  }

  tilemap.land.removeTileAt(this.x, this.y);
  tilemap.sea.removeTileAt(this.x, this.y);

  occupiedLand.delete(`${this.x},${this.y}`);

  this.landmass.squares.delete(`${this.y},${this.x}`);
  this.settlement?.remove();

  this.landmass.landmasses[this.islandIndex].delete(this);
  this.scene.events.removeListener(`${this.y},${this.x}`);
}
