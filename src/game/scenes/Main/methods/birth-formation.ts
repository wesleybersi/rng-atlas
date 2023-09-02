import MainScene from "../MainScene";
import generateRandomCountryName from "../../../entities/Formation/helper/random-name";
import { random } from "../../../utils/helper-functions";

import Formation from "../../../entities/Formation/Formation";
import climates, { climateKeys } from "../../../entities/GeoMap/land/climates";
import GeoMap from "../../../entities/GeoMap/GeoMap";

function birthFormation(
  scene: MainScene,
  amount: number,
  targetSize: number,
  id: number
) {
  const x = random(scene.mapWidth);
  const y = random(scene.mapHeight);
  const climate = climates.get(climateKeys[random(climateKeys.length)]);
  if (!climate) return;
  const newLandmass = new Formation(
    scene,
    generateRandomCountryName(),
    { x, y, elevation: random(5) },
    new Map(),
    climate
  );
  newLandmass.form(0, random(targetSize));
  amount--;
  if (amount > 0) {
    requestAnimationFrame(() => birthFormation(scene, amount, targetSize, id));
  } else {
    cancelAnimationFrame(id);
  }
}

function generateWorldmap(this: MainScene, isStart = true) {
  if (isStart) {
    if (this.grid) this.grid.destroy();
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);

    this.grid = this.add.grid(
      0,
      0,
      this.mapWidth * 2,
      this.mapHeight * 2,
      64,
      64,
      undefined,
      0,
      0xffffff,
      0.05
    );

    this.grid.setStrokeStyle(1, 0xffffff);
    this.grid.scale = 0.5;
    this.grid.setOrigin(0, 0);
    this.grid.setDepth(0);
    this.tilemap = new GeoMap(this);
  }

  setTimeout(() => {
    const { continents, islands, isles } = this.client.generate;
    if (continents.amount > 0) {
      const id1 = requestAnimationFrame(() =>
        birthFormation(this, continents.amount, continents.targetSize, id1)
      );
    }
    if (islands.amount > 0) {
      const id2 = requestAnimationFrame(() =>
        birthFormation(this, islands.amount, islands.targetSize, id2)
      );
    }
    if (isles.amount > 0) {
      const id3 = requestAnimationFrame(() =>
        birthFormation(this, isles.amount, isles.targetSize, id3)
      );
    }
  }, 1000);
}
export default generateWorldmap;
