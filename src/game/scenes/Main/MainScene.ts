import Phaser from "phaser";

import preload from "./methods/preload";
import create from "./methods/create";
import EventEmitter from "eventemitter3";
import { ToolName } from "../../../store/types";

import GeoMap from "../../entities/GeoMap/GeoMap";
import Formation from "../../entities/Formation/Formation";
import Square from "../../entities/Square/Square";
import reactEventListener from "./methods/react-events";
import generateWorldmap from "./methods/birth-formation";
import { ClimateName } from "../../entities/GeoMap/land/climates";
import Country from "../../entities/Country/Country";
import { oneIn } from "../../utils/helper-functions";
import Settlement from "../../entities/Settlement/Settlement";

export const climateWeights = {
  Tropical: 0.3,
  Mediterranean: 0.5,
  Arid: 0.1,
  Temperate: 0.2,
  Polar: 0.1,
  Alien: 0.5,
};

export default class MainScene extends Phaser.Scene {
  isLoading = true;
  background!: Phaser.GameObjects.Graphics;
  overlay!: Phaser.GameObjects.Graphics;
  tilemap!: GeoMap;
  context!: CanvasRenderingContext2D;
  grid!: Phaser.GameObjects.Grid;
  isActive = false;
  hasStarted = false;
  reactEvents!: EventEmitter<string | symbol, any> | null;
  mapWidth = 0;
  mapHeight = 0;
  cellWidth = 1;
  cellHeight = 1;
  deadzoneRect!: Phaser.GameObjects.Rectangle;
  buttons = { meta: false };
  occupiedLand: Map<string, Square> = new Map();
  formCount = 0;
  formingLandmasses = new Set<Formation>();
  maxFormingLandmasses = 10;
  pixelScale = 1;

  client: {
    tool: ToolName;
    selectMode: "Country" | "Landmass";
    amount: number;
    spread: number;
    tint: number | null;
    rotation: number;
    maxTargetSize: number;
    eraserRadius: number;
    climate: ClimateName;
    generate: {
      continents: { amount: number; targetSize: number };
      islands: { amount: number; targetSize: number };
      isles: { amount: number; targetSize: number };
    };
  } = {
    tool: "Pointer",
    selectMode: "Landmass",
    amount: 5,
    spread: 8,
    tint: null,
    rotation: 0,
    maxTargetSize: 2500,
    eraserRadius: 0.5,
    climate: "Temperate",
    generate: {
      continents: { amount: 0, targetSize: 25000 },
      islands: { amount: 0, targetSize: 10000 },
      isles: { amount: 0, targetSize: 1000 },
    },
  };
  hideSettlements = false;
  settlementData: {
    icon: string;
    name: string;
    population: number;
    description: string[];
  } | null = null;
  additionals = 0;
  formations: Map<string, Formation> = new Map();
  countries: Set<Country> = new Set();

  minZoom = 2;
  rotate: "Right" | "Left" | "None" = "None";

  selected: {
    formation: Formation | null;
    country: Country | null;
    massIndex: number | null;
  } = {
    formation: null,
    country: null,
    massIndex: null,
  };
  hover: {
    x: number;
    y: number;
    z: number;
    formation: Formation | null;
    massIndex: number | null;
    country: Country | null;
  } = {
    x: -1,
    y: -1,
    z: -1,
    formation: null,
    massIndex: null,
    country: null,
  };
  eraser = { landmasses: new Set<Formation>() };
  isDragging: {
    squares: Set<Square>;
    target: Square;
    prevPos: { x: number; y: number };
  } | null = null;
  mapData: {
    forming: number;
    landmassCount: number;
    expanse: number;
    countryCount: number;
  } = {
    forming: 0,
    landmassCount: 0,
    expanse: 0,
    countryCount: 0,
  };

  preload = preload;
  create = create;

  reactEventListener = reactEventListener;
  frameCounter = 0;
  stateText!: Phaser.GameObjects.Text;
  progressText!: Phaser.GameObjects.Text;
  progress = "";
  generateWorldmap = generateWorldmap;
  containers!: {
    game: Phaser.GameObjects.Container;
  };
  constructor() {
    super({ key: "Main" });
  }

  update() {
    this.frameCounter++;
    if (this.frameCounter % 60 === 0) {
      this.frameCounter = 0;
    }

    if (this.isActive && !this.hasStarted) {
      this.hasStarted = true;
      this.generateWorldmap();
    }

    const prevLandmassCount = this.mapData.landmassCount;
    const prevExpanse = this.mapData.expanse;
    const prevForming = this.mapData.forming;
    const prevCountryCount = this.mapData.countryCount;

    let landmassCount = 0;
    let expanse = 0;
    for (const [_, landmass] of this.formations) {
      landmassCount += landmass.landmasses.length;
      expanse += landmass.squares.size;
    }

    if (
      prevLandmassCount !== landmassCount ||
      prevExpanse !== expanse ||
      prevForming !== this.formingLandmasses.size ||
      prevCountryCount !== this.countries.size
    ) {
      this.mapData.landmassCount = landmassCount;
      this.mapData.expanse = expanse;
      this.mapData.forming = this.formingLandmasses.size;
      this.mapData.countryCount = this.countries.size;
      this.reactEvents?.emit("Map Data", this.mapData);
    }

    // this.stateText?.destroy();

    // this.stateText = this.add.text(
    //   this.cameras.main.worldView.left,
    //   this.cameras.main.worldView.top,
    //   `
    //   Forming: ${this.mapData.forming}
    //   Landmass count: ${this.mapData.landmassCount}
    //   Total expanse: ${this.mapData.expanse}km2`
    // );

    // this.stateText.setDepth(200);
    // this.stateText.setFill(0x222222);
    // this.stateText.setFontSize(32 / this.cameras.main.zoom);
    if (this.rotate === "Right") {
      this.client.rotation += 3;
    } else if (this.rotate === "Left") {
      this.client.rotation -= 3;
    }
    if (this.rotate) {
      this.reactEvents?.emit("Client Update", this.client);
    }

    if (this.client.selectMode === "Landmass") {
      this.hideSettlements = true;
    } else if (this.client.selectMode === "Country") {
      this.hideSettlements = false;
    }

    for (const country of this.countries) {
      if (country.squares.size < 50) continue;
      if (!country.locationOfCapital) {
        for (const [_, square] of country.squares) {
          if (oneIn(2)) continue;
          country.locationOfCapital = { x: square.x, y: square.y };
          square.settlement = new Settlement(
            this,
            0,
            "",
            country.capital,
            [""],
            0,
            square.x,
            square.y
          );
          break;
        }
      }
    }

    // Update camera angle
    this.cameras.main.setAngle(-this.client.rotation);

    // Set the camera zoom level based on the requiredZoom value
    // this.cameras.main.setZoom(requiredZoom);

    this.progressText?.destroy();

    this.progressText = this.add.text(
      this.cameras.main.worldView.left,
      this.cameras.main.worldView.bottom,
      this.progress
    );

    this.progressText.setDepth(200);
    this.progressText.setFill(0x222222);
  }
}
