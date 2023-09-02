import { Climate } from "../GeoMap/land/climates";
import MainScene from "../../scenes/Main/MainScene";

import { oneIn, random } from "../../utils/helper-functions";

import Formation from "../Formation/Formation";

import Settlement from "../Settlement/Settlement";
import generateRandomCountryName from "../Formation/helper/random-name";
import expand from "./methods/expand";
import remove from "./methods/remove";
import draw from "./methods/draw";
import surroundingSquares, {
  emptySurroundings,
  shuffledSurroundings,
} from "./methods/surroundings";
import formRiver from "./methods/form-river";
import subtract from "./methods/subtract";
import merge from "./methods/merge";
import convert from "./methods/convert";
import spawnIsland from "./methods/spawn-islands";
import Country from "../Country/Country";
import conquer from "./methods/conquer";

class Square {
  scene: MainScene;
  y: number;
  x: number;
  active = true;
  climate: Climate;
  climateSet: number;
  elevation: number;
  landmass: Formation;
  expanded = false;
  isBorder = false;
  isCountryBorder = false;
  hasShoreline = false;
  color: number;
  surroundings!: {
    top: { x: number; y: number };
    right: { x: number; y: number };
    bottom: { x: number; y: number };
    left: { x: number; y: number };
  };
  islandIndex = 0;
  settlement?: Settlement;
  country: Country | null = null;
  //Methods
  expand = expand;
  subtract = subtract;
  remove = remove;
  merge = merge;
  convert = convert;
  draw = draw;
  spawnIsland = spawnIsland;
  formRiver = formRiver;
  surroundingSquares = surroundingSquares;
  emptySurroundings = emptySurroundings;
  shuffledSurroundings = shuffledSurroundings;
  conquer = conquer;
  constructor(
    scene: MainScene,
    y: number,
    x: number,
    elevation: number,
    climate: Climate,
    landmass: Formation,
    islandIndex = 0,
    climateSet = 0
  ) {
    if (y < 0 || x < 0 || y > scene.mapHeight || x > scene.mapWidth) {
      this.remove();
    }
    this.scene = scene;
    this.y = y;
    this.x = x;
    this.landmass = landmass;
    this.climate = climate;
    this.elevation =
      elevation > 7 && oneIn(landmass.mountainProbability)
        ? Math.max(this.climate.colors[climateSet].length - random(12), 0)
        : elevation;

    this.climateSet = climateSet;
    this.color = this.climate.colors[climateSet][this.elevation];

    this.scene.occupiedLand.set(`${x},${y}`, this);
    this.landmass.squares.set(`${y},${x}`, this);
    this.islandIndex = islandIndex;
    this.landmass.landmasses[islandIndex].add(this);
    this.updateSurroundings();

    if (oneIn(3000)) {
      this.settlement = new Settlement(
        this.scene,
        0,
        "",
        generateRandomCountryName(),
        [""],
        random(5_000_000),
        this.x,
        this.y
      );
    }

    this.scene.tilemap.sea.removeTileAt(this.x, this.y);
    this.draw();
  }

  updateSurroundings() {
    this.surroundings = {
      top: { y: this.y - 1, x: this.x },
      right: { y: this.y, x: this.x + 1 },
      bottom: { y: this.y + 1, x: this.x },
      left: { y: this.y, x: this.x - 1 },
    };
  }

  clampElevation() {
    if (this.elevation > this.climate.colors[this.climateSet].length - 1) {
      this.elevation = this.climate.colors[this.climateSet].length - 1;
    } else if (this.elevation < 0) this.elevation = 0;
  }
}

export default Square;
