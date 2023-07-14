import Phaser from "phaser";

import preload from "./methods/preload";
import create from "./methods/create";

import updateViewport from "./methods/update-viewport";
import Square from "../../entities/Square/Square";

export enum Climate {
  Tropical = "Tropical",
  Mediterranean = "Mediterranean",
  Arid = "Arid",
  Temperate = "Temperate",
  Polar = "Polar",
}

export const climateWeights = {
  Tropical: 0.3,
  Mediterranean: 0.5,
  Arid: 0.1,
  Temperate: 0.2,
  Polar: 0.1,
  Alien: 0.5,
};
export interface Territory {
  name: string;
  origin: { row: number; col: number };
  squares: Map<string, Square>;
  expanse: number;
  climate: Climate;
}

export default class MainScene extends Phaser.Scene {
  renderTexture!: Phaser.GameObjects.RenderTexture;
  rowCount = 540;
  colCount = 960;
  cellWidth = 1;
  cellHeight = 1;
  deadzoneRect!: Phaser.GameObjects.Rectangle;
  buttons = { meta: false };
  dragStart: { row: number; col: number } | null = null;
  draggingRail = false;

  formCount = 0;
  viewport: {
    startRow: number;
    startCol: number;
    visibleRows: number;
    visibleCols: number;
  } = { startRow: 0, startCol: 0, visibleCols: 0, visibleRows: 0 };

  parameters = { landmasses: 40, islands: 50 };
  // parameters = { landmasses: 15, islands: 25 };
  // parameters = { landmasses: 2, islands: 5 };
  territories: Map<string, Territory> = new Map();
  additionals: Map<string, Territory> = new Map();
  playZoomLevel = 2;
  editorZoomLevel = 2;
  hover: {
    row: number;
    col: number;
    x: number;
    y: number;
  } = { row: -1, col: -1, x: -1, y: -1 };

  //External Methods
  preload = preload;
  create = create;
  updateViewport = updateViewport;
  frameCounter = 0;
  stateText!: Phaser.GameObjects.Text;
  progressText!: Phaser.GameObjects.Text;
  progress = "";
  constructor() {
    super({ key: "Main" });
  }

  update(time: number, delta: number) {
    const camera = this.cameras.main;
    this.frameCounter++;
    if (this.frameCounter % 60 === 0) {
      this.frameCounter = 0;
    }

    // camera.deadzone?.setSize(
    //   camera.worldView.width * 0.4,
    //   camera.worldView.height * 0.3
    // );
    // if (this.deadzoneRect && camera.deadzone) {
    //   this.deadzoneRect.x = camera.deadzone.x + camera.deadzone.width / 2;
    //   this.deadzoneRect.y = camera.deadzone.y + camera.deadzone.height / 2;
    //   this.deadzoneRect.width = camera.deadzone.width;
    //   this.deadzoneRect.height = camera.deadzone.height;
    //   this.deadzoneRect.setDepth(2000);
    //   this.deadzoneRect.setOrigin(0.5);
    //   this.deadzoneRect.alpha = 0.05;
    // }

    // camera.on("followupdate", this.updateViewport, this);

    this.stateText?.destroy();

    this.stateText = this.add.text(
      this.cameras.main.worldView.left,
      this.cameras.main.worldView.top,
      `${this.hover.row} ${this.hover.col}`
    );

    this.stateText.setDepth(200);
    this.stateText.setFill(0x222222);

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
