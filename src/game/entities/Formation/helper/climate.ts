import MainScene from "../../../scenes/Main/MainScene";
import { ClimateName } from "../../GeoMap/land/climates";

export default function randomClimate(
  scene: MainScene,
  x: number,
  y: number
): ClimateName {
  const { mapHeight: rowCount, mapWidth: colCount } = scene;
  const climateWeights = {
    Polar:
      (y > rowCount / 6 && y < rowCount - rowCount / 6) ||
      x < colCount / 4 ||
      x > colCount - colCount / 4
        ? 0.025
        : 0.95,
    SubArctic: y > rowCount / 4 && y < rowCount - rowCount / 4 ? 0.025 : 0.95,
    Rocky: 0.15,
    Mediterranean: 0.25,
    Tropical: y > rowCount / 3 && y < rowCount - rowCount / 3 ? 0.2 : 0,
    Arid: y > rowCount / 3 && y < rowCount - rowCount / 3 ? 0.25 : 0,
    Temperate: 0.3,
  };
  const totalWeight = Object.values(climateWeights).reduce(
    (sum, weight) => sum + weight,
    0
  );
  let randomValue = Math.random() * totalWeight;
  for (const [climate, weight] of Object.entries(climateWeights)) {
    randomValue -= weight;
    if (randomValue <= 0) {
      return climate as ClimateName;
    }
  }
  return "Temperate" as ClimateName;
}
