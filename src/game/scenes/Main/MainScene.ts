import Phaser from "phaser";

import preload from "./methods/preload";
import create from "./methods/create";
import EventEmitter from "eventemitter3";
import { ToolName } from "../../../store/types";

import GeoMap from "../../entities/GeoMap/GeoMap";
import Landmass from "../../entities/Landmass/Landmass";
import Square from "../../entities/Square/Square";
import reactEventListener from "./methods/react-events";
import generateWorldmap from "./methods/form-landmasses";
import { ClimateName } from "../../entities/GeoMap/land/climates";

export const climateWeights = {
  Tropical: 0.3,
  Mediterranean: 0.5,
  Arid: 0.1,
  Temperate: 0.2,
  Polar: 0.1,
  Alien: 0.5,
};

export default class MainScene extends Phaser.Scene {
  tilemap!: GeoMap;
  context!: CanvasRenderingContext2D;
  grid!: Phaser.GameObjects.Grid;
  isActive = false;
  hasStarted = false;
  reactEvents!: EventEmitter<string | symbol, any> | null;
  // rowCount = 540;
  // colCount = 960;
  // rowCount = window.innerHeight;
  // colCount = window.innerWidth;

  colCount = window.screen.width / 2;
  rowCount = window.screen.height / 2;
  cellWidth = 1;
  cellHeight = 1;
  deadzoneRect!: Phaser.GameObjects.Rectangle;
  buttons = { meta: false };
  dragStart: { row: number; col: number } | null = null;
  draggingRail = false;
  activeShoreline: Landmass | null = null;
  hasShoreLine: Set<Landmass> = new Set();
  occupiedLand: Map<string, Square> = new Map();
  formCount = 0;
  formingLandmasses = new Set();
  maxFormingLandmasses = 25;
  viewport: {
    startRow: number;
    startCol: number;
    visibleRows: number;
    visibleCols: number;
  } = { startRow: 0, startCol: 0, visibleCols: 0, visibleRows: 0 };
  pixelScale = 1;

  client: {
    tool: ToolName;
    maxTargetSize: number;
    climate: ClimateName;
    generate: {
      continents: { amount: number; targetSize: number };
      islands: { amount: number; targetSize: number };
      isles: { amount: number; targetSize: number };
    };
  } = {
    tool: "Pointer",
    maxTargetSize: 50,
    climate: "Temperate",
    generate: {
      continents: { amount: 25, targetSize: 200 },
      islands: { amount: 50, targetSize: 50 },
      isles: { amount: 75, targetSize: 15 },
    },
  };
  additionals = 0;
  landmasses: Map<string, Landmass> = new Map();
  playZoomLevel = 3;
  selected: { landmass: Landmass | null; islandIndex: number | null } = {
    landmass: null,
    islandIndex: null,
  };
  hover: {
    x: number;
    y: number;
    z: number;
    zoomLock: { x: number; y: number } | null;
    landmass: Landmass | null;
    islandIndex: number | null;
  } = {
    x: -1,
    y: -1,
    z: -1,
    zoomLock: null,
    landmass: null,
    islandIndex: null,
  };

  preload = preload;
  create = create;

  reactEventListener = reactEventListener;
  frameCounter = 0;
  stateText!: Phaser.GameObjects.Text;
  progressText!: Phaser.GameObjects.Text;
  progress = "";
  generateWorldmap = generateWorldmap;
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
    // this.stateText?.destroy();

    // this.stateText = this.add.text(
    //   this.cameras.main.worldView.left,
    //   this.cameras.main.worldView.top,
    //   `x:${this.hover.x} y:${this.hover.y} z:${this.hover.z}
    //   ${
    //     this.hover.landmass
    //       ? `${this.hover.landmass.name} - ${this.hover.landmass.climate} - ${this.hover.landmass.squares.size}`
    //       : ""
    //   }
    //   Creating: ${this.formingLandmasses.size} / ${this.landmasses.size}
    //   "Zoom": ${this.cameras.main.zoom.toFixed(2)}`
    // );

    // this.stateText.setDepth(200);
    // this.stateText.setFill(0x222222);
    // this.stateText.setFontSize(32 / this.cameras.main.zoom);

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
