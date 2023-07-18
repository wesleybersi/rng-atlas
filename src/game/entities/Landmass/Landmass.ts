import { create } from "zustand";
import MainScene from "../../scenes/Main/MainScene";
import { oneIn, random } from "../../utils/helper-functions";
import { ClimateName, climates } from "../GeoMap/land/climates";

import Square from "../Square/Square";

class Landmass {
  scene: MainScene;
  name: string;
  origin: { x: number; y: number; elevation: number };
  squares: Map<string, Square>;
  targetExpanse: number;
  terrainDifference = Math.max(random(20), 5);
  islandSettings = {
    probability: Math.max(random(500), 200),
    spread: Math.max(random(80), 25),
    additionalExpansion: random(50),
  };
  mountainProbability = Math.max(random(200), 50);
  riverProbability = Math.max(random(100), 25);
  wetness = Math.max(random(250), 10);
  climate: ClimateName;
  hasShoreLine = false;
  hasRivers = false;
  hasFormed = false;
  carvingRivers = new Set<Square>();
  priority = false;
  islands: Set<Square>[] = [new Set()];
  constructor(
    scene: MainScene,
    name: string,
    origin: { x: number; y: number; elevation: number },
    squares: Map<string, Square>,
    expanse: number,
    climate: ClimateName
  ) {
    this.scene = scene;
    this.name = name;
    this.origin = origin;
    this.squares = squares;
    this.targetExpanse = expanse;
    this.climate = climate;
    scene.landmasses.set(this.name, this);

    //First square
  }

  diminishMass(islandIndex: number) {
    let amount = random(100);
    const subtract = () => {
      if (amount > 0) {
        for (const square of this.islands[islandIndex]) {
          square.defineBorders();
          if (square.isBorder && oneIn(random(3))) square.subtract(3, 0);
        }

        amount--;
        requestAnimationFrame(subtract);
      } else {
        this.addShoreLine(islandIndex);
        cancelAnimationFrame(requestId);
        return;
      }
    };

    const requestId = requestAnimationFrame(subtract);
  }
  removeMass(islandIndex: number) {
    const subtract = () => {
      if (this.islands[islandIndex].size > 0) {
        for (const square of this.islands[islandIndex]) {
          square.subtract(2);
        }

        requestAnimationFrame(subtract);
      } else {
        for (const square of this.islands[islandIndex]) {
          square.remove();
        }
        this.islands.splice(islandIndex, 1);
        cancelAnimationFrame(requestId);
        return;
      }
    };

    const requestId = requestAnimationFrame(subtract);
  }

  expandMass(islandIndex = 0) {
    let inQueue = true;
    const states = [
      "Clean",
      "Expand",
      "Coastal Islands",
      "Solidify",
      "Define Borders",
      "Carve Rivers",
      "Add Shoreline",
      "Add Cities",
      "Define Islands",
      "Finish",
    ];
    let state = 0;

    const creation = this.squares.size === 0;

    const initialSet = new Set<Square>();
    for (const square of Array.from(this.islands[islandIndex])) {
      initialSet.add(square);
    }
    const expandedSet = new Set();
    const islands: Set<Square> = new Set();
    // let wetness = this.wetness;
    let islandExpansion = this.islandSettings.additionalExpansion;
    let riverStart = false;
    let target = this.targetExpanse;

    const create = () => {
      console.log(states[state]);
      const { formingLandmasses, maxFormingLandmasses } = this.scene;
      const { islandSettings } = this;
      if (
        (inQueue &&
          formingLandmasses.size < maxFormingLandmasses &&
          !formingLandmasses.has(this)) ||
        this.priority
      ) {
        formingLandmasses.add(this);
        inQueue = false;
      }

      if (inQueue) return requestAnimationFrame(create);
      if (creation) {
        new Square(
          this.scene,
          this.origin.y,
          this.origin.x,
          this.origin.elevation,
          this,
          0,
          random(random(climates.get(this.climate)?.colors.length ?? 0))
        ).expand(true);
      }
      const squares = Array.from(this.islands[islandIndex]);

      switch (states[state]) {
        case "Clean":
          for (const square of squares) {
            if (square.isBorder) {
              this.scene.tilemap.shoreLine.removeTileAt(square.x, square.y);
            }
          }
          state++;
          break;
        case "Expand": {
          if (target > 0) {
            target--;
            console.log(target);
            const startCount = expandedSet.size;

            for (const square of squares) {
              if (expandedSet.has(square)) continue;
              expandedSet.add(square);
              square.expand();

              if (oneIn(islandSettings.probability)) {
                square.spawnIsland();
              }

              // if (squares.length > 200 && oneIn(wetness)) {
              //   square.subtract(oneIn(5) ? 2 : undefined);
              //   wetness++;
              // }
            }

            const endCount = expandedSet.size;
            if (startCount >= endCount) {
              state++;
              break;
            }
          } else {
            state++;
          }
          break;
        }
        case "Coastal Islands":
          if (islands.size === 0) {
            for (const square of Array.from(squares)) {
              if (islands.has(square)) continue;
              if (oneIn(this.islandSettings.probability)) {
                islands.add(square);
                square.spawnIsland();
              }
            }
          } else {
            if (islandExpansion > 0) {
              for (const square of islands) {
                square.expand();
              }
              islandExpansion--;
            } else {
              state++;
            }
          }
          break;
        case "Solidify":
          for (const square of Array.from(squares)) {
            if (initialSet.has(square)) continue;
            if (oneIn(Math.max(random(10), 2))) continue;
            square.expand(true);
          }
          for (const square of Array.from(squares)) {
            if (initialSet.has(square)) continue;
            if (oneIn(Math.max(random(10), 2))) continue;
            square.expand(true);
          }
          for (const square of Array.from(squares)) {
            if (initialSet.has(square)) continue;
            square.expand();
          }
          for (const square of Array.from(squares)) {
            if (initialSet.has(square)) continue;
            if (this.climate === "Polar") square.formIce();
          }
          state++;
          break;
        case "Define Borders":
          for (const square of Array.from(squares)) {
            square.defineBorders();
          }
          state++;
          break;
        case "Carve Rivers":
          {
            if (this.squares.size < 200) {
              this.addShoreLine(islandIndex);
              state++;
            }
            if (!riverStart) {
              riverStart = true;
              for (const square of Array.from(squares)) {
                if (oneIn(2)) continue;
                if (square.isBorder && oneIn(this.riverProbability)) {
                  square.formRiver(initialSet);
                }
              }
            } else if (this.carvingRivers.size === 0) state++;
          }
          break;

        case "Add Shoreline":
          this.oceanGrading(islandIndex);
          state++;
          break;
        case "Add Cities":
          state++;
          break;
        case "Define Islands":
          this.defineIslands();
          state++;
          break;
        case "Finish":
          setTimeout(() => {
            if (creation) this.scene.formCount++;
            this.hasFormed = true;
            console.log(
              `%c${this.name} has succesfully been ${
                creation ? "formed" : "expanded"
              } with an expanse of ${this.squares.size}`,
              "background-color: #00cc44; color: white"
            );
          });
          formingLandmasses.delete(this);
          this.scene.events.emit("Landmass Has Formed", this);
          // this.targetExpanse = this.squares.size;
          return cancelAnimationFrame(requestId);
      }
      requestAnimationFrame(create);
    };

    this.hasShoreLine = false;
    this.hasRivers = false;
    this.hasFormed = false;

    const requestId = requestAnimationFrame(create);
  }
  log(creation: boolean) {
    console.log(
      `%c${creation ? "Forming new" : "Expanding"} landmass at x: ${
        this.origin.x
      }, y: ${this.origin.y}}`,
      "background-color: #2277ff; color: white"
    );
    console.log(
      `%cTarget expanse ${this.targetExpanse}`,
      "background-color: #2277ff; color: white"
    );
    console.log(
      `%cClimate: ${this.climate}`,
      "background-color: #2277ff; color: white"
    );
    console.log(
      `%cElevation change: 1 in ${this.terrainDifference}`,
      "background-color: #2277ff; color: white"
    );
    console.log(
      `%cIsland probability: 1 in ${this.islandSettings.probability} with a max spread of ${this.islandSettings.spread}`,
      "background-color: #2277ff; color: white"
    );
  }
  addShoreLine(islandIndex: number) {
    if (this.scene.pixelScale > 1) return;
    for (const square of Array.from(this.islands[islandIndex])) {
      square.defineBorders();
    }
    for (const square of Array.from(this.islands[islandIndex])) {
      if (square.isWaterBorder) {
        this.scene.tilemap.placeShoreLine(square.x, square.y, 0.175);
      }
    }
  }
  showOverlay() {
    for (const [_, square] of Array.from(this.squares)) {
      this.scene.tilemap.placeColoredTile(square.x, square.y, 0x222222, 0.35);
    }
  }

  showBorder(islandIndex: number) {
    for (const square of this.islands[islandIndex]) {
      if (square.isBorder) {
        this.scene.tilemap.placeShoreLine(square.x, square.y, 0.75, 0x000000);
      }
    }
  }
  hideBorder(keepShoreline?: boolean) {
    for (const [_, square] of Array.from(this.squares)) {
      if (square.isBorder) {
        if (keepShoreline) {
          if (this.scene.pixelScale > 1) return;
          this.scene.tilemap.placeShoreLine(square.x, square.y, 0.25);
        } else {
          this.scene.tilemap.shoreLine.removeTileAt(square.x, square.y);
        }
      }
    }
  }
  hideShoreLine() {
    for (const [_, square] of Array.from(this.squares)) {
      if (square.isBorder) {
        this.scene.tilemap.shoreLine.removeTileAt(square.x, square.y);
      }
    }
  }

  oceanGrading(islandIndex: number) {
    const initialSet: Set<{ x: number; y: number }> = new Set();
    for (const square of Array.from(this.islands[islandIndex])) {
      if (square.isWaterBorder) initialSet.add({ x: square.x, y: square.y });
    }
    const interval = Math.max(random(9), 3);

    const expand = (
      id: number,
      set: Set<{ x: number; y: number }>,
      depth: number,
      iteration = 0,
      includedSet: Set<string> = new Set()
    ) => {
      const newSet: Set<{ x: number; y: number }> = new Set();
      for (const square of set) {
        const surroundings = {
          top: { y: square.y - 1, x: square.x },
          right: { y: square.y, x: square.x + 1 },
          bottom: { y: square.y + 1, x: square.x },
          left: { y: square.y, x: square.x - 1 },
        };
        if (oneIn(3)) continue;
        for (const [_, { x, y }] of Object.entries(surroundings).sort(
          () => Math.random() - 0.5
        )) {
          if (includedSet.has(`${x},${y}`)) {
            continue;
          }
          let overrule = undefined;
          const tileInPlace = this.scene.tilemap.sea.getTileAt(x, y);
          if (tileInPlace) overrule = (depth + tileInPlace.alpha) / 2;

          if (iteration % (interval - 1) === 0) overrule = depth * 1.25;
          if (iteration % interval === 0) overrule = depth * 1.75;
          if (iteration % (interval + 1) === 0) overrule = depth * 1.25;

          this.scene.tilemap.placeWhiteTile(
            x,
            y,
            iteration < 2 ? 0 : overrule ?? depth + Math.random() * 0.02
          );
          newSet.add({ x, y });
          includedSet.add(`${x},${y}`);
        }
      }

      if (!oneIn(4)) depth -= 0.01;
      else depth += 0.0075;

      if (depth > 0)
        requestAnimationFrame(() =>
          expand(id, newSet, depth, (iteration += 1), includedSet)
        );
      else {
        return cancelAnimationFrame(id);
      }
    };
    const depths = requestAnimationFrame(() => expand(depths, initialSet, 0.1));
  }

  defineIslands() {
    const squares = new Map([...this.squares]);
    const positions = new Set<string>();

    const newIsland = (
      square: Square,
      island: Set<Square>,
      index: number
    ): Set<Square> => {
      island.add(square);
      squares.delete(`${square.y},${square.x}`);
      square.islandIndex = index;
      positions.add(`${square.y},${square.x}`);
      for (const [_, { x, y }] of Object.entries(square.surroundings)) {
        if (positions.has(`${y},${x}`)) continue;
        const object = this.squares.get(`${y},${x}`);
        if (object && !island.has(object)) {
          newIsland(object, island, index);
        }
      }
      return island;
    };

    const nextSquare = (): void => {
      for (const [_, square] of squares) {
        const island = newIsland(square, new Set(), this.islands.length);
        this.islands.push(island);
        return nextSquare();
      }
    };

    //TODO Add and remove instead of redo
    this.islands = [];
    nextSquare();
  }
  redraw() {
    for (const [_, square] of Array.from(this.squares)) {
      square.draw();
    }
    if (this.scene.pixelScale > 1) {
      this.hideBorder();
    }
    for (const island of this.islands) {
      if (this.scene.pixelScale === 1) {
        this.addShoreLine(this.islands.indexOf(island));
      }
    }
  }
}

export default Landmass;
