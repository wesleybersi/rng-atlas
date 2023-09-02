import MainScene from "../../scenes/Main/MainScene";
import { random } from "../../utils/helper-functions";
import { Climate } from "../GeoMap/land/climates";

import Square from "../Square/Square";
import Country from "../Country/Country";
import form from "./methods/form/form";
import clear from "./methods/clear";
import addNewArrivals from "./methods/new-arrivals";
import addShoreLine from "./methods/add-shoreline";
import addShore from "./methods/add-shore";
import seperateMass from "./methods/seperate-mass";
import showBorder from "./methods/show-border";

class Formation {
  scene: MainScene;
  name: string;
  origin: { x: number; y: number; elevation: number };
  terrainDifference = Math.max(random(30), 5);
  islandSettings = {
    probability: Math.max(random(500), 200),
    spread: Math.max(random(80), 25),
    additionalExpansion: random(100),
  };
  mountainProbability = Math.max(random(100), 50);
  riverProbability = Math.max(random(100), 25);
  wetness = Math.max(random(250), 50);
  climate: Climate;
  climateOffset = { min: random(7), max: random(7) };
  hasRivers = false;
  hasFormed = false;
  forceFinish = false;
  forceAbort = false;
  carvingRivers = new Set<Square>();
  priority = false;
  newArrivals: Set<Square> = new Set();
  squares: Map<string, Square>;
  landmasses: Set<Square>[] = [new Set()];
  countries: Set<Country>[] = [new Set()];
  form = form;
  clear = clear;
  addNewArrivals = addNewArrivals;
  addShoreline = addShoreLine;
  addShore = addShore;
  seperateMass = seperateMass;
  showBorder = showBorder;
  constructor(
    scene: MainScene,
    name: string,
    origin: { x: number; y: number; elevation: number },
    squares: Map<string, Square>,
    climate: Climate
  ) {
    this.scene = scene;
    this.name = name;
    this.origin = origin;
    this.squares = squares;
    this.climate = climate;
    scene.formations.set(this.name, this);
  }

  redraw() {
    for (const [_, square] of Array.from(this.squares)) {
      square.draw();
    }
  }
}

export default Formation;
