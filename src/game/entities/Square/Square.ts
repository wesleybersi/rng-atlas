import MainScene from "../../scenes/Main/MainScene";
import { Cardinal, Connection, Direction, SquarePosition } from "../../types";
import { getOppositeSide } from "../../utils/helper-functions";
import { Territory } from "../../scenes/Main/MainScene";
import SeaSquare from "../SeaSquare/SeaSquare";
import Ice from "../Ice/Ice";

const reliefLevels = ["0x6fa33d"];

// const reliefMapColors = [
//   0x6fa33d, 0x83a83b, 0x98ad39, 0xadb237, 0xc3b735, 0xd8bc34, 0xeec132,
//   0xffcb30, 0xffcb30, 0xffc02f, 0xffab2e, 0xff962d, 0xff812c, 0xff6c2b,
//   0xff5829, 0xff4328, 0xff2e27, 0xff1926,
// ];

// const reliefMapColors = [
//   0x6fa33d, 0x79aa3c, 0x83b33c, 0x8dbc3b, 0x97c53b, 0xa1ce3a, 0xabc83a,
//   0xb5d139, 0xbfc939, 0xc9d239, 0xd3db38, 0xdde438, 0xe7ed37, 0xf1f637,
//   0xfaf436, 0xfaf436, 0xf9ef36, 0xf8e836, 0xf7e236, 0xf6db35, 0xf5d535,
//   0xf4ce34, 0xf3c734, 0xf2c034, 0xf1b934, 0xf0b233, 0xffab2e, 0xff962d,
//   0xff812c, 0xff6c2b, 0xff5829, 0xff4328, 0xff2e27, 0xff1926,
// ];

const reliefMapColors = {
  Tropical: [
    0x3c700a, 0x4d811b, 0x5e922c, 0x6fa33d, 0x79aa3c, 0x83b33c, 0x8dbc3b,
    0x97c53b, 0xa1ce3a, 0xabc83a, 0xb5d139, 0xbfc939, 0xc9d239, 0xd3db38,
    0xdde438, 0xe7ed37, 0xf1f637, 0xfaf436, 0xfaf436, 0xf9ef36, 0xf8e836,
    0xf7e236, 0xf6db35, 0xf5d535, 0xf4ce34, 0xf3c734, 0xf2c034, 0xf1b934,
    0xf0b233, 0xffab2e, 0xff962d,
  ],
  Mediterranean: [
    0x3c700a, 0x4d811b, 0x5e922c, 0x6fa33d, 0x7da842, 0x8bae47, 0x99b44c,
    0xa7ba52, 0xb5bf57, 0xc3c45c, 0xd1ca61, 0xdfcf67, 0xeed46c, 0xfcd972,
    0xfadb77, 0xf8e07c, 0xf6e581, 0xf4ea86, 0xf2ef8c, 0xf0f492, 0xeef997,
    0xe4c68a, 0xd9bb82, 0xceaf7b, 0xc3a473, 0xb8976b, 0xac8d64, 0xa1815c,
    0x9b7c53, 0x8a6b42, 0x795a31,
  ],

  Lush: [
    0xd6e8c3, 0xc2db9e, 0xaed07a, 0x9ac456, 0x86b832, 0x6baf0c, 0x78b429,
    0x85bb46, 0x92c263, 0x9fc880, 0x5ea23a, 0x6bac57, 0x78b574, 0x85bf91,
    0x92c9ae, 0x4d9868, 0x5aa285, 0x67aca2, 0x74b6bf, 0x81c0dc, 0x3d8c96,
    0x4a96b3, 0x57a0d0, 0x64aaed, 0x71b4ff,
  ],

  Alien: [
    0xd9c3e6, 0xbfa7d8, 0xa78bca, 0x8f6ebc, 0x7742ae, 0x5e60ce, 0x6c63c5,
    0x7a66bc, 0x8869b3, 0x966cad, 0x485bb7, 0x5670b1, 0x6485ab, 0x729aa5,
    0x80afa0, 0x365baa, 0x4584a3, 0x53ada0, 0x61d69a, 0x6eef95, 0x243f9d,
    0x357d95, 0x44bb8c, 0x52f884, 0x61ff7c,
  ],

  Arid: [
    0xb7b090, 0xc4ba98, 0xd2c3a0, 0xdfcda8, 0xedd6b1, 0xfadfb9, 0xf7e8c1,
    0xf4f0ca, 0xf1f9d2, 0xf0f8d2, 0xeef7d1, 0xedf6d0, 0xecf5ce, 0xebf4cd,
    0xe9f3cc, 0xe8f2cb, 0xe7f1ca, 0xe6f0c8, 0xe4efc7, 0xe3eec6, 0xe2edc5,
    0xe1ecc4, 0xdfebc2, 0xdeead1, 0xddeddc, 0xdcefe6,
  ],
  Temperate: [
    0x2b6009, 0x3c700a, 0x4d811b, 0x5e922c, 0x6fa33d, 0x7da842, 0x8bae47,
    0x99b44c, 0xa7ba52, 0xb5bf57, 0xc3c45c, 0xd1ca61, 0xdfcf67, 0xeed46c,
    0xfcd972, 0xfadb77, 0xf8e07c, 0xf6e581, 0xf4ea86, 0xf2ef8c, 0xf0f492,
    0xeef997, 0xedf29c, 0xeaf7a1, 0xe8fca6, 0xe5fcaf, 0xe3fcb8, 0xe0fcc1,
    0xddfcca, 0xeeffdd, 0xfefefe, 0xffffff,
  ],
  Polar: [
    0xffffff, 0xf7fbfb, 0xeff6f6, 0xe7f1f1, 0xdfebec, 0xd7e6e6, 0xcfe1e1,
    0xc7dbdb, 0xbfd6d6, 0xb7d1d1, 0xafcccc, 0xa7c7c7, 0x9fc2c2, 0x97bdbd,
    0x8fb8b8, 0x87b3b3, 0x7fafaf, 0x77aaaa, 0x6fa5a5, 0x67a0a0, 0x5f9b9b,
    0x579696, 0x4f9191, 0x478c8c, 0x408787,
  ],
};

class Square extends Phaser.GameObjects.Image {
  scene: MainScene;
  row: number;
  col: number;
  elevation: number;
  color: number;
  waterBorder!: Phaser.GameObjects.Image;
  territory: Territory;
  expanded = false;
  isBorder = false;
  isWaterBorder = false;
  constructor(
    scene: MainScene,
    row: number,
    col: number,
    elevation: number,
    territory: Territory
  ) {
    super(scene as MainScene, col, row, "pixel");
    if (row < 0 || col < 0 || row > scene.rowCount || col > scene.colCount) {
      this.remove();
    }
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.elevation = elevation;
    this.color = reliefMapColors[territory.climate][elevation];
    this.territory = territory;
    this.setTint(this.color);
    this.territory.squares.set(`${row},${col}`, this);
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
  }
  draw() {
    if (!this.active) return;
    if (this.isWaterBorder) {
      this.waterBorder = this.scene.add.image(this.x, this.y, "pixel");
      this.waterBorder.alpha = 0.255;

      const positions = {
        top: { row: this.row - 1, col: this.col },
        right: { row: this.row, col: this.col + 1 },
        bottom: { row: this.row + 1, col: this.col },
        left: { row: this.row, col: this.col - 1 },
      };

      for (const [side, position] of Object.entries(positions)) {
        let hasObject = false;
        this.scene.events.emit(
          `${position.row},${position.col}`,
          "Ping",
          (object?: Square) => {
            if (object) {
              hasObject = true;
            }
          }
        );
        if (!hasObject) {
          //Scatter water effect
          const waterSet: Set<string> = new Set();
          for (
            let i = 0;
            i < Math.floor(Math.random() * Math.floor(Math.random() * 250));
            i++
          ) {
            const spread = Math.floor(Math.random() * 32);
            const addCol = Math.floor(Math.random() * spread - spread / 2);
            const addRow = Math.floor(Math.random() * spread - spread / 2);
            if (
              !waterSet.has(`${position.row + addRow},${position.col + addCol}`)
            ) {
              waterSet.add(`${position.row + addRow},${position.col + addCol}`);
              const additionalWater = this.scene.add.sprite(
                position.col + addCol,
                position.row + addRow,
                "pixel"
              );
              additionalWater.alpha = 0.025;
              additionalWater.setDepth(0);
            }
          }
        }
      }
    }
    this.color = reliefMapColors[this.territory.climate][this.elevation];
    this.setTint(this.color);
  }
  formRiver() {
    if (!this.active) return;
    interface Positions {
      top: { row: number; col: number };
      right: { row: number; col: number };
      bottom: { row: number; col: number };
      left: { row: number; col: number };
    }

    const positions: Positions = {
      top: { row: this.row - 1, col: this.col },
      right: { row: this.row, col: this.col + 1 },
      bottom: { row: this.row + 1, col: this.col },
      left: { row: this.row, col: this.col - 1 },
    };

    const calculateDistance = (position: { row: number; col: number }) => {
      const { row: originRow, col: originCol } = this.territory.origin;
      const { row: positionRow, col: positionCol } = position;

      const distance = Math.sqrt(
        Math.pow(positionCol - originCol, 2) +
          Math.pow(positionRow - originRow, 2)
      );

      return distance;
    };

    let shortest = Infinity;
    let prefers: Cardinal;
    for (const [side, position] of Object.entries(positions)) {
      const distance = calculateDistance(position);
      if (distance < shortest) {
        shortest = distance;
        prefers = side as Cardinal;
      }
    }

    let flowAmount = Math.floor(Math.random() * 32);
    if (!Math.floor(Math.random() * 20)) {
      flowAmount = Math.floor(Math.random() * 200);
    }
    const flow = (positions: Positions) => {
      for (const [side, position] of Object.entries(positions).sort(
        () => Math.random() - 0.5
      )) {
        if (flowAmount <= 0) break;
        if (side !== prefers) {
          if (!Math.floor(Math.random() * 3)) continue;
        }

        const objectInPlace = this.territory.squares.get(
          `${position.row},${position.col}`
        );
        if (objectInPlace) {
          // if (!Math.floor(Math.random() * 20)) objectInPlace.formRiver();
          const positions = {
            top: { row: objectInPlace.row - 1, col: objectInPlace.col },
            right: { row: objectInPlace.row, col: objectInPlace.col + 1 },
            bottom: { row: objectInPlace.row + 1, col: objectInPlace.col },
            left: { row: objectInPlace.row, col: objectInPlace.col - 1 },
          };
          objectInPlace.setActive(false);
          objectInPlace.remove();
          flowAmount--;
          flow(positions);
          break;
        }
      }
    };
    flow(positions);
    //TODO Give river names
  }
  expand(expandAll?: boolean) {
    if (!this.active) return;
    if (this.expanded && !expandAll) return;
    const positions = {
      top: { row: this.row - 1, col: this.col },
      right: { row: this.row, col: this.col + 1 },
      bottom: { row: this.row + 1, col: this.col },
      left: { row: this.row, col: this.col - 1 },
    };

    const changeElevation = Math.floor(Math.random() * 5);

    for (const [side, position] of Object.entries(positions)) {
      if (
        position.row < 0 ||
        position.row > this.scene.rowCount ||
        position.col < 0 ||
        position.col > this.scene.colCount
      )
        continue;
      let objectInPlace: Square | null = null;
      this.scene.events.emit(
        `${position.row},${position.col}`,
        "Ping",
        (object?: Square) => {
          if (object && object instanceof Square) {
            objectInPlace = object;
          }
        }
      );

      if (!objectInPlace && (expandAll || !Math.floor(Math.random() * 2))) {
        let elevation = this.elevation;
        // const changeAmount = Math.floor(
        //   Math.random() * Math.floor(Math.random() * 4)
        // );
        const changeAmount = 1;

        if (changeElevation === 1 && elevation > changeAmount)
          elevation -= changeAmount;
        if (
          changeElevation === 2 &&
          elevation <
            reliefMapColors[this.territory.climate].length - 1 + changeAmount
        )
          elevation += changeAmount;

        new Square(
          this.scene,
          position.row,
          position.col,
          elevation,
          this.territory
        );
      } else if (expandAll && objectInPlace) {
        if (
          !this.territory.squares.has(
            `${objectInPlace.row},${objectInPlace.col}`
          )
        ) {
          if (changeElevation === 1 && objectInPlace.elevation > 0)
            objectInPlace.elevation = Math.max(this.elevation - 1, 0);
          if (
            changeElevation === 2 &&
            objectInPlace.elevation < reliefMapColors.length
          )
            objectInPlace.elevation = Math.min(
              this.elevation + 1,
              reliefMapColors[objectInPlace.territory.climate].length - 1
            );

          objectInPlace.draw();
        }
      }
    }

    this.expanded = true;
    this.draw();
  }
  defineBorders(noRivers?: boolean) {
    if (!this.active) return;
    const positions = {
      top: { row: this.row - 1, col: this.col },
      right: { row: this.row, col: this.col + 1 },
      bottom: { row: this.row + 1, col: this.col },
      left: { row: this.row, col: this.col - 1 },
    };
    this.isBorder = false;
    let objCount = 0;

    for (const [side, position] of Object.entries(positions)) {
      if (!this.territory.squares.has(`${position.row},${position.col}`)) {
        this.isBorder = true;
      }
      this.scene.events.emit(
        `${position.row},${position.col}`,
        "Ping",
        (object?: Square) => {
          if (object && object instanceof Square) {
            objCount++;
          }
        }
      );
    }

    this.isWaterBorder = objCount !== 4;
    if (!noRivers && this.isWaterBorder && !Math.floor(Math.random() * 50)) {
      this.formRiver();
    }
  }
  formIce() {
    if (!this.active) return;
    const positions = {
      top: { row: this.row - 1, col: this.col },
      right: { row: this.row, col: this.col + 1 },
      bottom: { row: this.row + 1, col: this.col },
      left: { row: this.row, col: this.col - 1 },
    };

    for (const [side, position] of Object.entries(positions)) {
      let objectInPlace: Square | SeaSquare | null = null;
      this.scene.events.emit(
        `${position.row},${position.col}`,
        "Ping",
        (object?: Square | SeaSquare) => {
          if (
            (object && object instanceof Square) ||
            object instanceof SeaSquare
          ) {
            objectInPlace = object;
          }
        }
      );
      if (!objectInPlace) {
        new Ice(
          this.scene,
          position.row,
          position.col,
          0,
          getOppositeSide(side as Cardinal)
        );
      }
    }
  }

  formSeaBorder() {
    if (!this.active) return;
    const positions = {
      top: { row: this.row - 1, col: this.col },
      right: { row: this.row, col: this.col + 1 },
      bottom: { row: this.row + 1, col: this.col },
      left: { row: this.row, col: this.col - 1 },
    };

    for (const [side, position] of Object.entries(positions)) {
      if (
        position.row < 0 ||
        position.row > this.scene.rowCount ||
        position.col < 0 ||
        position.col > this.scene.colCount
      )
        continue;
      let objectInPlace: Square | SeaSquare | null = null;
      this.scene.events.emit(
        `${position.row},${position.col}`,
        "Ping",
        (object?: Square | SeaSquare) => {
          if (
            (object && object instanceof Square) ||
            object instanceof SeaSquare
          ) {
            objectInPlace = object;
          }
        }
      );
      if (!objectInPlace) {
        new SeaSquare(
          this.scene,
          position.row,
          position.col,
          0,
          getOppositeSide(side as Cardinal)
        );
      }
    }
  }

  remove() {
    if (!this.scene) return;
    this.territory.squares.delete(`${this.row},${this.col}`);
    this.scene.events.removeListener(`${this.row},${this.col}`);
    this.destroy();
  }
}

export default Square;
