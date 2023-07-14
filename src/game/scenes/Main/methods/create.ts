import { climateWeights } from "./../MainScene";
import Square from "../../../entities/Square/Square";
import { Connection, SquarePosition } from "../../../types";
import {
  generateRandomColor,
  generateReliefColor,
  get90degrees,
  getOppositeDirection,
  getSteepPositions,
  is90degrees,
} from "../../../utils/helper-functions";
import MainScene, { Climate, Territory } from "../MainScene";

export default function create(this: MainScene) {
  console.log("Main: Create");
  const worldWidth = this.colCount * this.cellWidth;
  const worldHeight = this.rowCount * this.cellHeight;

  // const startCol = Math.floor(this.colCount / 2);
  // const startRow = Math.floor(this.rowCount / 2);

  //ANCHOR Camera
  const camera = this.cameras.main;

  camera.setBounds(0, 0, worldWidth, worldHeight);
  camera.zoom = this.playZoomLevel;

  // camera.startFollow(this.player, true, 0.1, 0.1);
  camera.roundPixels = true;
  // camera.centerOn(0, 0);

  // requestAnimationFrame(() => {
  //   console.log(camera.worldView.width);
  //   console.log(camera.worldView.height);

  //   camera.setDeadzone(camera.worldView.width, camera.worldView.height);
  //   camera.setLerp(0.15);
  //   this.deadzoneRect = this.add.rectangle(
  //     camera.deadzone?.centerX,
  //     camera.deadzone?.centerY,
  //     camera.deadzone?.width,
  //     camera.deadzone?.height,
  //     0x000000,
  //     0
  //   );
  //   this.deadzoneRect.setOrigin(0.5, 0.5);
  // });

  //ANCHOR Pointer events
  this.input.mouse?.disableContextMenu();
  this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    const xPadding = this.cellWidth * 0.5;
    const yPadding = this.cellHeight * 0.5;
    this.hover.x = pointer.worldX;
    this.hover.y = pointer.worldY;

    const row = Math.floor(pointer.worldY / this.cellHeight);
    const col = Math.floor(pointer.worldX / this.cellWidth);

    if (
      pointer.worldX >= col * this.cellWidth + xPadding / 2 &&
      pointer.worldX >= col * this.cellWidth - xPadding / 2 &&
      pointer.worldY >= row * this.cellHeight + yPadding / 2 &&
      pointer.worldY >= row * this.cellHeight - yPadding / 2
    ) {
      this.hover.row = row;
      this.hover.col = col;
    }
  });

  this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    let objectInPlace: Square | null = null;

    this.events.emit(
      `${this.hover.row},${this.hover.col}`,
      "Ping",
      (object: unknown) => {
        if (object && object instanceof Square) {
          objectInPlace = object;
        }
      }
    );

    if (!objectInPlace) {
      formNewTerritory(this.hover.col, this.hover.row, 300);
    } else {
      expandTerritory(objectInPlace as Square);
    }
  });

  const formNewTerritory = (
    x: number,
    y: number,
    expansionRate: number,
    forceClimate?: Climate
  ) => {
    const newTerritory = {
      name: Math.random().toString(),
      origin: { row: y, col: x },
      squares: new Map(),
      expanse: Math.floor(Math.random() * expansionRate),

      climate: (() => {
        if (forceClimate) return forceClimate;
        const climateWeights = {
          // Tropical:
          //   y > this.rowCount / 4 && y < this.rowCount - this.rowCount / 4
          //     ? 0.5
          //     : 0,
          Mediterranean: 0.25,
          Arid:
            y > this.rowCount / 3 && y < this.rowCount - this.rowCount / 3
              ? 0.3
              : 0,
          Temperate: 0.25,
          Polar:
            (y > this.rowCount / 6 && y < this.rowCount - this.rowCount / 6) ||
            x < this.colCount / 4 ||
            x > this.colCount - this.colCount / 4
              ? 0.025
              : 0.9,
        };
        // const climateWeights = {
        //   // Alien: 0.5,
        //   // Volcanic: 0.5,
        //   // Lush: 0.5,
        //   // Polar: 0.25,
        // };

        const totalWeight = Object.values(climateWeights).reduce(
          (sum, weight) => sum + weight,
          0
        );
        let randomValue = Math.random() * totalWeight;

        for (const [climate, weight] of Object.entries(climateWeights)) {
          randomValue -= weight;
          if (randomValue <= 0) {
            return climate as Climate;
          }
        }
        return "Temperate" as Climate;
      })(),
    };
    this.territories.set(newTerritory.name, newTerritory);

    const newSquare = new Square(this, y, x, 0, newTerritory);

    const interval = setInterval(() => {
      if (newTerritory.expanse >= 0) {
        newTerritory.expanse--;
        expandTerritory(newSquare);
      } else {
        solidifyTerritory(newSquare);
        clearInterval(interval);
      }
    }, 0);
  };
  for (let i = 0; i < this.parameters.landmasses; i++) {
    const x = Math.floor(Math.random() * this.colCount);
    const y = Math.floor(Math.random() * this.rowCount);

    //Landmasses / Continents
    formNewTerritory(x, y, 400);
  }

  for (let i = 0; i < this.parameters.islands; i++) {
    const x = Math.floor(Math.random() * this.colCount);
    const y = Math.floor(Math.random() * this.rowCount);

    //Islands
    formNewTerritory(x, y, 50);
  }

  // for (let i = 0; i < this.parameters.islandsSmall; i++) {
  //   const x = Math.floor(Math.random() * this.colCount);
  //   const y = Math.floor(Math.random() * this.rowCount);

  //   //Smallest islands
  //   formNewTerritory(x, y, 5);
  // }

  const solidifyTerritory = (square: Square) => {
    const territory = this.territories.get(square.territory.name);
    if (!territory) return;

    const expandCount = territory.squares.size > 50 ? 100 : 50;
    for (const [string, square] of Array.from(territory.squares)) {
      for (let i = 0; i < Math.floor(Math.random() * expandCount); i++) {
        square.expand(true);
      }
      for (let i = 0; i < Math.floor((Math.random() * expandCount) / 2); i++) {
        square.expand();
      }
    }

    this.formCount++;
    this.events.emit("New Territory Formed");
  };

  this.events.on("New Territory Formed", () => {
    if (
      this.formCount ===
      this.parameters.landmasses + this.parameters.islands
    ) {
      const handled: Set<Territory> = new Set();
      let additionalCount = 0;
      for (const [name, territory] of this.territories) {
        for (const [pos, square] of territory.squares) {
          if (!square.active) continue;
          if (territory.climate === "Polar") square.formIce();
          setTimeout(() => {
            if (square.active) square.defineBorders();
            setTimeout(() => {
              //
            }, 0);
          }, 0);
        }
        handled.add(territory);
      }
      setTimeout(() => {
        for (const [name, territory] of this.territories) {
          const islandProbability = Math.floor(Math.random() * 50);
          const size = territory.squares.size;
          let isleCount = 0;
          const maxIsles = Math.max(
            Math.floor((Math.random() * size) / 100),
            Math.floor(Math.random() * 8)
          );
          console.log(maxIsles);
          for (const [pos, square] of territory.squares) {
            if (square.isWaterBorder) {
              if (!Math.floor(Math.random() * 8)) {
                isleCount++;
                continue;
              }
              if (!Math.floor(Math.random() * islandProbability)) continue;
              const distance = Math.floor(Math.random() * 64);
              const addCol = Math.floor(
                Math.random() * distance - distance / 2
              );
              const addRow = Math.floor(
                Math.random() * distance - distance / 2
              );
              const position = {
                row: square.row + addRow,
                col: square.col + addCol,
              };

              let objectInPlace: Square | null = null;
              this.events.emit(
                `${position.row},${position.col}`,
                "Ping",
                (object: unknown) => {
                  if (object && object instanceof Square) {
                    objectInPlace = object;
                  }
                }
              );

              if (objectInPlace) {
                continue;
              }
              if (isleCount < maxIsles) {
                formNewTerritory(
                  position.col,
                  position.row,
                  Math.floor(Math.random() * 16),
                  territory.climate
                );
              }

              isleCount++;
              additionalCount++;
            }
          }
        }
      });
      setTimeout(() => {
        for (const [name, territory] of this.territories) {
          for (const [pos, square] of territory.squares) {
            if (!square.active) continue;
            setTimeout(() => {
              if (square.active) square.defineBorders(true);
              square.draw();
              setTimeout(() => {
                if (square.active) {
                  if (square.isWaterBorder) square.formSeaBorder();
                }
              }, 0);
            }, 0);
          }
        }
      });
    }
  });

  const expandTerritory = (square: Square) => {
    const territory = this.territories.get(square.territory.name);

    for (const [string, square] of Array.from(territory!.squares)) {
      square.expand();
    }
  };

  this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
    if (this.dragStart) {
      this.events.emit(`${this.hover.row},${this.hover.col}`, "Release");
    }
  });

  //ANCHOR Keyboard events
  this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
    switch (event.key) {
      case "PageUp":
        if (this.playZoomLevel < 6) this.playZoomLevel++;
        this.cameras.main.zoom = this.playZoomLevel;
        break;
      case "PageDown":
        if (this.playZoomLevel > 1) this.playZoomLevel--;
        this.cameras.main.zoom = this.playZoomLevel;
        break;
      case "Home":
        this.playZoomLevel = 3;
        this.cameras.main.zoom = this.playZoomLevel;
        break;
      case "Meta":
        this.buttons.meta = true;
        break;
      case "=":
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
        break;
    }
  });
  this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
    switch (event.key) {
      case "Meta":
        this.buttons.meta = false;
        break;
    }
  });

  this.input.on("wheel", (pointer: Phaser.Input.Pointer) => {
    if (pointer.deltaY < 0) {
      if (this.playZoomLevel < 5) {
        this.playZoomLevel += 1;
        camera.zoom = Math.floor(this.playZoomLevel);
      }
    } else if (pointer.deltaY > 0) {
      if (this.playZoomLevel > 1) {
        this.playZoomLevel -= 1;
        camera.zoom = Math.floor(this.playZoomLevel);
      } else {
        this.playZoomLevel = 0.5;
        camera.zoom = this.playZoomLevel;
      }
    }
  });

  // this.cameras.main.fadeIn(1000);
}
