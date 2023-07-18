import MainScene from "../MainScene";
import generateRandomCountryName from "../../../entities/Landmass/helper/random-name";
import { random } from "../../../utils/helper-functions";
import randomClimate from "../../../entities/Landmass/helper/climate";
import Landmass from "../../../entities/Landmass/Landmass";

function formLandmasses(scene: MainScene, amount: number, targetSize: number) {
  for (let i = 0; i < amount; i++) {
    const x = random(scene.colCount);
    const y = random(scene.rowCount);
    //Landmasses / Continents
    const newLandmass = new Landmass(
      scene,
      generateRandomCountryName(),
      { x, y, elevation: random(5) },
      new Map(),
      random(targetSize),
      randomClimate(scene, x, y)
    );
    newLandmass.expandMass();
  }
}

function generateWorldmap(this: MainScene) {
  const { continents, islands, isles } = this.client.generate;
  formLandmasses(this, continents.amount, continents.targetSize);
  formLandmasses(this, islands.amount, islands.targetSize);
  formLandmasses(this, isles.amount, isles.targetSize);
}
export default generateWorldmap;
