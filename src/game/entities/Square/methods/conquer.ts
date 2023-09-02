import { oneIn } from "../../../utils/helper-functions";
import Country from "../../Country/Country";
import Square from "../Square";

export default function conquer(this: Square, forceAll?: boolean): boolean {
  if (!this.country) {
    this.country = new Country(this.scene, this);
    this.scene.tilemap.placeCountryTile(
      this.x,
      this.y,
      this.country.color,
      0.45
    );
  }

  let hasConvert = false;
  for (const [_, neighbor] of this.surroundingSquares(true)) {
    if (neighbor.country) {
      if (oneIn(10) && this.country.squares.size > 100 && !forceAll) {
        this.country.squares.delete(`${this.x},${this.y}`);
        if (this.country?.squares.size === 0) {
          this.scene.countries.delete(this.country);
        }
        this.country = neighbor.country;
        this.country.squares.set(`${this.x},${this.y}`, this);
        this.scene.tilemap.placeCountryTile(
          this.x,
          this.y,
          this.country.color,
          0.45
        );
        neighbor.conquer();
        break;
      }
      continue;
    }
    hasConvert = true;
    neighbor.country = this.country;
    neighbor.country.squares.set(`${neighbor.x},${neighbor.y}`, neighbor);
    this.scene.tilemap.placeCountryTile(
      neighbor.x,
      neighbor.y,
      neighbor.country.color,
      0.45
    );

    // console.log("C", this.country.squares.size);
    // console.log("L", this.landmass.squares.size);
  }
  return hasConvert;
}
