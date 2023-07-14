import MainScene from "../../scenes/Main/MainScene";
import { Connection, SquarePosition } from "../../types";
import { generateRandomColor } from "../../utils/helper-functions";
import { Territory } from "../../scenes/Main/MainScene";
import Square from "../Square/Square";

// const seaReliefColors = [
//   0xf5f7ff, 0xffffff, 0xffffff, 0xf9f5ff, 0xf3eeff, 0xe7e6ff, 0xd1d9ff,
//   0xbbc7ff, 0xa5b6ee, 0x8fa4dd, 0x7992cc, 0x6381bb, 0x4c6fab, 0x375b9a,
//   0x264a89,
// ];

const relief = [
  0x274890, 0xffffff, 0xe3e7f7, 0xe5e9fa, 0xe8ecfd, 0xeaf0ff, 0xecf3ff,
  0xf0f5ff, 0xf0f5ff, 0xedf2ff, 0xeaf0ff, 0xe7eeff, 0xe3ecff, 0xe0eaff,
  0xdde8ff, 0xdbe7ff, 0xd8e6ff, 0xd4e4ff, 0xd1e3ff, 0xcee1ff, 0xcbe0ff,
  0xc8deff, 0xc5ddff, 0xc2dcff, 0xbfdaff, 0xbbd8ff, 0xb8d7ff, 0xb5d5ff,
  0xb3d4ff, 0xb0d3ff, 0xadd1ff, 0xabd0ff, 0xa8ceff, 0xa6cdff, 0xa3ccff,
  0xa1caff, 0x9ec9ff, 0x9cc8ff, 0x99c6ff, 0x97c5ff, 0x94c4ff, 0x92c3ff,
  0x90c1ff, 0x8dc0ff, 0x8bc0ff, 0x89beff, 0x86bdff, 0x84bcff, 0x82bbff,
  0x80b9ff, 0x7db8ff, 0x7bb7ff, 0x79b6ff, 0x77b4ff, 0x75b3ff, 0x73b2ff,
  0x71b1ff, 0x6fb0ff, 0x6daeff, 0x6bacff, 0x69abff, 0x67a9ff, 0x65a8ff,
  0x63a6ff, 0x61a5ff, 0x5fa4ff, 0x5da3ff, 0x5ba2ff, 0x5990f2, 0x5788e7,
  0x5580dc, 0x5377d1, 0x5170c6, 0x4f68bb, 0x4d60b0, 0x3b58a5, 0x294f9a,
  0x274890, 0x153978,
];

const seaReliefColors = relief.flatMap((color) => [color, color]);

class SeaSquare extends Phaser.GameObjects.Image {
  scene: MainScene;
  row: number;
  col: number;
  depth: number;
  color: number;
  expanded = false;
  landSide: "top" | "bottom" | "left" | "right";
  constructor(
    scene: MainScene,
    row: number,
    col: number,
    depth: number,
    landSide: "top" | "bottom" | "left" | "right"
  ) {
    super(scene as MainScene, col, row, "pixel");
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.depth = depth;
    this.color = seaReliefColors[depth];
    this.setTint(this.color);
    this.landSide = landSide;

    scene.add.existing(this);

    //Event listener listening to specific event
    this.scene.events.on(
      `${row},${col}`,
      (eventType: string, callback?: (object: unknown) => void) => {
        // console.log("Event:", eventType, "at", "Row:", row, "Col:", col);

        switch (eventType) {
          case "Ping":
            if (callback) callback(this);
            break;
          case "Remove":
            this.remove();
            break;
        }
      },
      this
    );
    this.expand();
  }
  draw() {
    this.color = seaReliefColors[this.depth];
    this.setTint(this.color);

    // if (this.depth < 6) this.alpha = 0.85;
    this.alpha = 0.04;
  }

  expand() {
    if (this.expanded) return;
    const positions = {
      top: { row: this.row - 1, col: this.col },
      right: { row: this.row, col: this.col + 1 },
      bottom: { row: this.row + 1, col: this.col },
      left: { row: this.row, col: this.col - 1 },
    };

    for (const [side, position] of Object.entries(positions).sort(
      () => Math.random() - 0.5
    )) {
      if (
        position.row < 0 ||
        position.row > this.scene.rowCount ||
        position.col < 0 ||
        position.col > this.scene.colCount
      )
        continue;
      switch (this.landSide) {
        case "top":
        case "bottom":
          if (
            (side === "left" || side === "right") &&
            !Math.floor(Math.random() * 3)
          )
            continue;
          break;

        case "right":
        case "left":
          if (
            (side === "top" || side === "bottom") &&
            !Math.floor(Math.random() * 3)
          )
            continue;
          break;
      }
      let objectInPlace: SeaSquare | Square | null = null;
      this.scene.events.emit(
        `${position.row},${position.col}`,
        "Ping",
        (object?: SeaSquare | Square) => {
          if (
            (object && object instanceof Square) ||
            object instanceof SeaSquare
          ) {
            objectInPlace = object;
          }
        }
      );

      const amount = Math.floor(Math.random() * 3 + 1);

      let newDepth = this.depth + amount;
      if (!Math.floor(Math.random() * 10))
        newDepth = Math.max(0, this.depth - 2);

      if (!objectInPlace && this.depth + amount < seaReliefColors.length - 1) {
        new SeaSquare(
          this.scene,
          position.row,
          position.col,
          newDepth,
          this.landSide
        );
      }
    }

    this.expanded = true;
    this.draw();
    // this.normalize();
  }
  normalize() {
    const positions = {
      top: { row: this.row - 1, col: this.col },
      right: { row: this.row, col: this.col + 1 },
      bottom: { row: this.row + 1, col: this.col },
      left: { row: this.row, col: this.col - 1 },
    };

    for (const [side, position] of Object.entries(positions).sort(
      () => Math.random() - 0.5
    )) {
      if (Math.floor(Math.random() * 10)) continue;
      this.scene.events.emit(
        `${position.row},${position.col}`,
        "Ping",
        (object?: SeaSquare | Square) => {
          if (
            (object && object instanceof Square) ||
            object instanceof SeaSquare
          ) {
            if (Math.abs(object.depth - this.depth) > 1) {
              // Calculate the average depth
              const averageDepth = (object.depth + this.depth) / 2;

              // Assign the average depth to both objects
              object.depth = averageDepth;
              this.depth = averageDepth;
              if (averageDepth < seaReliefColors.length - 1) {
                // this.expand();
                object.expand();
              }
            }
          }
        }
      );
    }
  }

  remove() {
    this.scene.events.removeListener(`${this.row},${this.col}`);
    this.destroy();
  }
}

export default SeaSquare;
