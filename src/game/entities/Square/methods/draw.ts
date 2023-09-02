import Square from "../Square";

export default function draw(this: Square) {
  //   this.elevation = 1;
  //   this.climateSet = 0;
  if (!this.active) return;

  this.clampElevation();

  if (this.scene.cameras.main.zoom === 1) {
    if (this.x % 4 !== 0 || this.y % 4 !== 0) {
      this.scene.tilemap.land.removeTileAt(this.x, this.y);
      return;
    }
  } else if (
    this.scene.cameras.main.zoom > 1 &&
    this.scene.cameras.main.zoom < 2
  ) {
    if (this.x % 2 === 0 && this.y % 2 === 0) {
      this.scene.tilemap.land.removeTileAt(this.x, this.y);
      return;
    }
  }

  this.color = this.scene.tilemap.placeLandtile(
    this.x,
    this.y,
    this.climate.name,
    this.climateSet,
    this.landmass,
    this.elevation,
    undefined
  );
}
