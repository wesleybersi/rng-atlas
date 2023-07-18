import { create } from "zustand";
import MainScene from "../../scenes/Main/MainScene";
import { seaColors } from "./sea/colors";
import Landmass from "../Landmass/Landmass";
import { ClimateName, climates } from "./land/climates";
import { random } from "../../utils/helper-functions";
import getAverageColor from "./land/average";

export default class GeoMap {
  scene: MainScene;
  pixelMap: Phaser.Tilemaps.Tilemap;
  pixelTiles!: Phaser.Tilemaps.Tileset;
  land!: Phaser.Tilemaps.TilemapLayer;
  sea!: Phaser.Tilemaps.TilemapLayer;
  shoreLine!: Phaser.Tilemaps.TilemapLayer;
  // settlements!: Phaser.Tilemaps.TilemapLayer;
  constructor(scene: MainScene) {
    this.scene = scene as MainScene;

    //The map keeping track of all the layers
    this.pixelMap = scene.make.tilemap({
      tileWidth: 1,
      tileHeight: 1,
      width: scene.colCount,
      height: scene.rowCount,
    });

    const pixelTiles = this.pixelMap.addTilesetImage("pixel");
    if (pixelTiles) this.pixelTiles = pixelTiles;

    const seaLayer = this.pixelMap.createBlankLayer(
      "Sea Layer",
      this.pixelTiles,
      0,
      0,
      scene.colCount,
      scene.rowCount,
      1,
      1
    );

    const landLayer = this.pixelMap.createBlankLayer(
      "Land Layer",
      this.pixelTiles,
      0,
      0,
      scene.colCount,
      scene.rowCount,
      1,
      1
    );

    const shoreLineLayer = this.pixelMap.createBlankLayer(
      "Shoreline Layer",
      this.pixelTiles,
      0,
      0,
      scene.colCount,
      scene.rowCount,
      1,
      1
    );

    if (landLayer) this.land = landLayer;
    if (seaLayer) this.sea = seaLayer;
    if (shoreLineLayer) this.shoreLine = shoreLineLayer;

    this.sea.setDepth(0);
    this.land.setDepth(1);
    this.shoreLine.setDepth(2);

    this.sea.alpha = 0.45;
  }
  placeLandtile(
    x: number,
    y: number,
    climateName: ClimateName,
    climateSet: number,
    landmass: Landmass,
    elevation: number,
    tint?: number
  ) {
    if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount) {
      return;
    }
    const newTile = this.land.putTileAt(0, x, y);
    if (!newTile) return;

    const climate = climates.get(climateName);
    if (!climate) return;

    newTile.properties = { climate: climateName, landmass, elevation };
    newTile.tint = tint ?? climate.colors[climateSet][elevation];
    newTile.alpha = 1;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }
  placeAverageTile(x: number, y: number, color1: number, color2: number) {
    if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount) {
      return;
    }
    const newTile = this.land.putTileAt(0, x, y);
    if (!newTile) return;

    newTile.tint = getAverageColor(color1, color2);
    newTile.alpha = 1;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }
  placeSeaTile(x: number, y: number, depth: number) {
    if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount) {
      return;
    }
    if (depth >= seaColors.length) return;
    const newTile = this.sea.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.tint = seaColors[depth];
    newTile.alpha = 0.15;
    // newTile.width = this.scene.pixelScale;
    // newTile.height = this.scene.pixelScale;
  }
  placeSnowPeak(x: number, y: number) {
    if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount) {
      return;
    }
    const newTile = this.land.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.alpha = 1;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }
  placeWhiteTile(x: number, y: number, alpha: number) {
    if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount) {
      return;
    }
    const newTile = this.sea.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.alpha = alpha;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }
  placeShoreLine(x: number, y: number, alpha: number, tint?: number) {
    if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount) {
      return;
    }
    const newTile = this.shoreLine.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.alpha = alpha;
    newTile.tint = tint ?? 0xffffff;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }

  placeColoredTile(x: number, y: number, tint: number, alpha: number) {
    if (y < 0 || y > this.scene.rowCount || x < 0 || x > this.scene.colCount) {
      return;
    }
    const newTile = this.land.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.tint = tint;
    newTile.alpha = alpha;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }

  createInitialOcean() {
    this.sea.forEachTile((tile) => {
      this.placeSeaTile(tile.x, tile.y, 0);
    });
  }
}
