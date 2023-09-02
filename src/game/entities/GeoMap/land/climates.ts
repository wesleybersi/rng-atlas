import Polar from "./climates/Polar";
import Subarctic from "./climates/Subarctic";
import Temperate from "./climates/Temperate";
import Mediterranean from "./climates/Mediterranean";
import Tropical from "./climates/Tropical";
import SemiArid from "./climates/SemiArid";
import Arid from "./climates/Arid";
import Desert from "./climates/Desert";
import Volcanic from "./climates/Volcanic";

export type ClimateName =
  | "Polar"
  | "Subarctic"
  | "Temperate"
  | "Mediterranean"
  | "Tropical"
  | "Semi-Arid"
  | "Arid"
  | "Desert"
  | "Volcanic";

export interface Climate {
  name: ClimateName;
  temperatures: { min: number; max: number };
  colors: number[][];
  shoreLine: number[];
}
const climates = new Map<ClimateName, Climate>();

climates.set("Polar", Polar);
climates.set("Subarctic", Subarctic);
climates.set("Temperate", Temperate);
climates.set("Mediterranean", Mediterranean);
climates.set("Tropical", Tropical);
climates.set("Semi-Arid", SemiArid);
climates.set("Arid", Arid);
climates.set("Desert", Desert);
climates.set("Volcanic", Volcanic);

export const climateKeys = Array.from(climates.keys()) as ClimateName[];
export default climates;
