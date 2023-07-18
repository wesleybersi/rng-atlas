import { Climate } from "../GeoMap/land/climates";
import MainScene from "../../scenes/Main/MainScene";
import { Cardinal, Surroundings } from "../../types";
import { oneIn, random } from "../../utils/helper-functions";

import Ice from "../Ice/Ice";

import Landmass from "../Landmass/Landmass";
import { canvasColors } from "../GeoMap/land/canvasColors";
import { climates } from "../GeoMap/land/climates";
import getAverageColor from "../GeoMap/land/average";

class Square {
  scene: MainScene;
  y: number;
  x: number;
  active = true;
  climate: Climate;
  climateSet: number;
  elevation: number;
  landmass: Landmass;
  expanded = false;
  isBorder = false;
  isWaterBorder = false;
  isCity = false;
  hasSnow = false;
  surroundings: {
    top: { x: number; y: number };
    right: { x: number; y: number };
    bottom: { x: number; y: number };
    left: { x: number; y: number };
  };
  islandIndex = 0;
  constructor(
    scene: MainScene,
    y: number,
    x: number,
    elevation: number,
    landmass: Landmass,
    islandIndex: number,
    climateSet = 0
  ) {
    if (y < 0 || x < 0 || y > scene.rowCount || x > scene.colCount) {
      this.remove();
    }
    this.scene = scene;
    this.y = y;
    this.x = x;
    this.landmass = landmass;
    this.climate = climates.get(this.landmass.climate)!;
    this.elevation =
      elevation > 7 && oneIn(landmass.mountainProbability)
        ? Math.max(this.climate.colors[climateSet].length - random(12), 0)
        : elevation;

    this.climateSet = climateSet;

    this.scene.occupiedLand.set(`${x},${y}`, this);
    this.landmass.squares.set(`${y},${x}`, this);
    this.islandIndex = islandIndex;
    this.landmass.islands[islandIndex].add(this);
    this.surroundings = {
      top: { y: y - 1, x },
      right: { y, x: x + 1 },
      bottom: { y: y + 1, x },
      left: { y, x: x - 1 },
    };

    // this.formSnowPeaks(false);
    this.draw();

    //Event listener listening to specific event
    this.scene.events.on(
      `${y},${x}`,
      (eventType: string, callback?: (object: unknown) => void) => {
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

  shuffledSurroundings() {
    return Object.values(this.surroundings).sort(() => Math.random() - 0.5);
  }

  // formSnowPeaks(force: boolean) {
  //   this.hasSnow =
  //     this.elevation >= this.climate.colors[this.climateSet].length - 5 &&
  //     (oneIn(50) || force);
  //   if (force) this.hasSnow = true;
  //   if (this.hasSnow) {
  //     this.scene.tilemap.placeSnowPeak(this.x, this.y);
  //     for (const { x, y } of this.shuffledSurroundings()) {
  //       const square = this.scene.occupiedLand.get(`${x},${y}`);
  //       if (square && !square.hasSnow && oneIn(2)) {
  //         square.formSnowPeaks(true);
  //       }
  //     }
  //   }
  // }

  draw() {
    if (!this.active) return;
    if (this.hasSnow) return;
    if (this.scene.cameras.main.zoom === 1) {
      if (this.x % 4 !== 0 || this.y % 4 !== 0) {
        this.scene.tilemap.land.removeTileAt(this.x, this.y);
        return;
      }
    } else if (
      this.scene.cameras.main.zoom > 1 &&
      this.scene.cameras.main.zoom < 2
    ) {
      if (this.x % 2 === 0 && this.y % 2 === 0) {
        this.scene.tilemap.land.removeTileAt(this.x, this.y);
        return;
      }
    }
    this.scene.tilemap.placeLandtile(
      this.x,
      this.y,
      this.climate.name,
      this.climateSet,
      this.landmass,
      this.elevation,
      undefined
    );
  }
  formRiver(
    exclude: Set<Square> = new Set(),
    forceLength?: number,
    forcePrefers?: Cardinal
  ) {
    if (!this.active) return;
    this.landmass.carvingRivers.add(this);
    const calculateDistance = (x: number, y: number) => {
      const { x: originX, y: originY } = this.landmass.origin;
      const distance = Math.sqrt(
        Math.pow(x - originX, 2) + Math.pow(y - originY, 2)
      );

      return distance;
    };

    let shortest = Infinity;
    let prefers: Cardinal;
    for (const [side, { x, y }] of Object.entries(this.surroundings)) {
      const distance = calculateDistance(x, y);
      if (distance < shortest) {
        shortest = distance;
        prefers = side as Cardinal;
      }
    }

    let flowAmount = Math.floor(Math.random() * 50);
    if (oneIn(20)) {
      //Once in a while, big river
      let maxRiverLength = 500;
      if (oneIn(50)) maxRiverLength += 500;

      flowAmount = Math.floor(Math.random() * maxRiverLength);
    } //Else chip away small pieces to add detail.

    if (forceLength) flowAmount = forceLength;

    let forkCount = 0;
    const flow = (positions: Surroundings): void => {
      for (const [side, { x, y }] of Object.entries(positions).sort(
        () => Math.random() - 0.5
      )) {
        if (flowAmount <= 0) break;
        if (side !== prefers) {
          if (oneIn(5)) continue;
        }
        const objectInPlace = this.landmass.squares.get(`${y},${x}`);
        if (objectInPlace) {
          if (exclude.has(objectInPlace)) continue;
          if (oneIn(50) && forkCount < 4) {
            forkCount++;
            objectInPlace.formRiver(exclude);
          } //Fork current river

          if (oneIn(25)) objectInPlace.subtract(2, 3); //Maybe a lake?
          this.scene.tilemap.land.removeTileAt(x, y);
          objectInPlace.active = false;
          objectInPlace.remove();
          flowAmount--;
          requestAnimationFrame(() => flow(objectInPlace.surroundings));
          return;
        }
      }
      setTimeout(() => {
        this.landmass.carvingRivers.delete(this);
        if (this.landmass.carvingRivers.size === 0) {
          this.landmass.addShoreLine(this.islandIndex);
        }
      }, 0);
    };
    requestAnimationFrame(() => flow(this.surroundings));
  }
  spawnIsland() {
    const { spread } = this.landmass.islandSettings;
    const { occupiedLand } = this.scene;

    const position = { x: this.x, y: this.y };
    position.x += Math.floor(random(spread) - spread / 2);
    position.y += Math.floor(random(spread) - spread / 2);

    if (!occupiedLand.has(`${position.x},${position.y}`)) {
      const island = new Square(
        this.scene,
        position.y,
        position.x,
        this.elevation,
        this.landmass,
        this.islandIndex
      );
      for (let i = 0; i < random(5); i++) {
        island.expand();
      }
      if (oneIn(5)) {
        island.spawnIsland();
      }
    }
  }

  subtract(chance?: number, secondary?: number) {
    const { occupiedLand } = this.scene;
    const carve = () => {
      for (const { x, y } of this.shuffledSurroundings()) {
        if (
          y < 0 ||
          y > this.scene.rowCount ||
          x < 0 ||
          x > this.scene.colCount
        )
          continue;
        if (oneIn(chance ?? 2)) {
          const square = occupiedLand.get(`${x},${y}`);
          square?.subtract(secondary ?? 3, secondary);
          square?.remove();
        }
      }
    };
    requestAnimationFrame(carve);
  }
  merge(amount: number, forceColor: number, mergingSet = new Set()) {
    if (amount === 0) return;
    amount--;
    mergingSet.add(`${this.x},${this.y}`);
    for (const { x, y } of this.shuffledSurroundings()) {
      if (mergingSet.has(`${x},${y}`)) continue;
      const neighbor = this.scene.occupiedLand.get(`${x},${y}`);
      if (!neighbor) continue;

      const color1 = forceColor;
      const color2 =
        neighbor.climate.colors[neighbor.climateSet][neighbor.elevation];
      const averageColor = getAverageColor(color1, color2);

      this.scene.tilemap.shoreLine.removeTileAt(this.x, this.y);
      this.scene.tilemap.shoreLine.removeTileAt(neighbor.x, neighbor.y);

      neighbor.landmass.squares.delete(`${neighbor.y},${neighbor.x}`);
      this.landmass.squares.set(`${neighbor.y},${neighbor.x}`, neighbor);
      neighbor.climate = this.climate;
      neighbor.climateSet = this.climateSet;
      neighbor.elevation = this.elevation;

      this.scene.tilemap.placeLandtile(
        this.x,
        this.y,
        this.climate.name,
        this.climateSet,
        this.landmass,
        this.elevation,
        averageColor
      );
      this.scene.tilemap.placeLandtile(
        neighbor.x,
        neighbor.y,
        neighbor.climate.name,
        neighbor.climateSet,
        neighbor.landmass,
        neighbor.elevation,
        averageColor
      );
      if (oneIn(2)) neighbor.merge(amount, color2, mergingSet);
    }
  }
  expand(fullExpand?: boolean): boolean {
    //Possibly extends square in four directions.
    //Returns true if succesful
    if (!this.active) return false;
    if (this.expanded && !fullExpand) return false;
    this.expanded = true;
    const { occupiedLand } = this.scene;
    const { climate, terrainDifference } = this.landmass;

    const r = random(terrainDifference);

    let merge = false;
    for (const { x, y } of this.shuffledSurroundings()) {
      if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount)
        continue;

      if (fullExpand || oneIn(2)) {
        if (!occupiedLand.has(`${x},${y}`)) {
          let elevation = this.elevation;
          if (r === 1) elevation -= random(2);
          if (r === 2) elevation += random(4);

          if (elevation > 12) {
            elevation += random(10) - random(10);
          }

          if (elevation > this.climate.colors[this.climateSet].length - 1) {
            elevation = this.climate.colors[this.climateSet].length - 1;
          } else if (elevation < 0) elevation = 0;

          if (oneIn(150)) {
            if (this.climateSet < this.climate.colors.length - 1) {
              this.climateSet++;
              console.log(this.climateSet);
            } else {
              this.climateSet = 0;
            }
          }

          new Square(
            this.scene,
            y,
            x,
            elevation,
            this.landmass,
            this.islandIndex,
            this.climateSet
          );
        } else {
          if (!this.landmass.squares.has(`${y},${x}`)) merge = true;
        }
      }
    }
    if (merge)
      this.merge(
        random(100),
        this.climate.colors[this.climateSet][this.elevation]
      );

    return true;
  }
  defineBorders() {
    if (!this.active) return;
    const { occupiedLand } = this.scene;
    this.isBorder = false;
    let count = 0;

    for (const { x, y } of this.shuffledSurroundings()) {
      if (occupiedLand.has(`${x},${y}`)) count++;
      if (!this.isBorder && !this.landmass.squares.has(`${y},${x}`)) {
        this.isBorder = true;
      }
    }

    //Not surrounded by four means bordering water.
    this.isWaterBorder = count !== 4;
  }
  formIce() {
    if (!this.active) return;
    const { occupiedLand } = this.scene;
    for (const { x, y } of this.shuffledSurroundings()) {
      if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount)
        continue;
      if (!occupiedLand.has(`${x},${y}`)) {
        new Ice(this.scene, y, x, 0);
      }
    }
  }

  remove() {
    if (!this.scene) return;
    const { tilemap, occupiedLand } = this.scene;
    tilemap.land.removeTileAt(this.x, this.y);
    tilemap.sea.removeTileAt(this.x, this.y);

    occupiedLand.delete(`${this.x},${this.y}`);

    this.landmass.squares.delete(`${this.y},${this.x}`);
    this.landmass.islands[this.islandIndex].delete(this);
    this.scene.events.removeListener(`${this.y},${this.x}`);
  }
}

export default Square;
