import { create } from "zustand";
import MainScene from "../../scenes/Main/MainScene";
import { seaColors } from "./sea/colors";
import Formation from "../Formation/Formation";
import climates, { ClimateName } from "./land/climates";
import { oneIn, random } from "../../utils/helper-functions";
import getAverageColor, { getOverlayColor } from "./land/average";

export default class GeoMap {
  scene: MainScene;
  pixelMap: Phaser.Tilemaps.Tilemap;
  pixelTiles!: Phaser.Tilemaps.Tileset;
  land!: Phaser.Tilemaps.TilemapLayer;
  sea!: Phaser.Tilemaps.TilemapLayer;
  country!: Phaser.Tilemaps.TilemapLayer;
  border!: Phaser.Tilemaps.TilemapLayer | null;

  // shoreLine!: Phaser.Tilemaps.TilemapLayer;
  // tint!: Phaser.Tilemaps.TilemapLayer;
  // settlements!: Phaser.Tilemaps.TilemapLayer;
  constructor(scene: MainScene) {
    this.scene = scene as MainScene;

    //The map keeping track of all the layers
    this.pixelMap = scene.make.tilemap({
      tileWidth: 1,
      tileHeight: 1,
      width: scene.mapWidth,
      height: scene.mapHeight,
    });

    const pixelTiles = this.pixelMap.addTilesetImage("pixel");
    if (pixelTiles) this.pixelTiles = pixelTiles;

    const seaLayer = this.pixelMap.createBlankLayer(
      "Sea Layer",
      this.pixelTiles,
      0,
      0,
      scene.mapWidth,
      scene.mapHeight,
      1,
      1
    );

    const landLayer = this.pixelMap.createBlankLayer(
      "Land Layer",
      this.pixelTiles,
      0,
      0,
      scene.mapWidth,
      scene.mapHeight,
      1,
      1
    );

    const countryLayer = this.pixelMap.createBlankLayer(
      "Country Layer",
      this.pixelTiles,
      0,
      0,
      scene.mapWidth,
      scene.mapHeight,
      1,
      1
    );

    if (landLayer) this.land = landLayer;
    if (seaLayer) this.sea = seaLayer;
    if (countryLayer) this.country = countryLayer;

    this.sea.setDepth(1);
    this.land.setDepth(2);
    this.country.setDepth(3);
    this.country.alpha = 0;

    this.sea.alpha = 0.5;

    this.clear();
  }

  createBorderLayer() {
    const borderLayer = this.pixelMap.createBlankLayer(
      "Border Layer",
      this.pixelTiles,
      0,
      0,
      this.scene.mapWidth,
      this.scene.mapHeight,
      1,
      1
    );
    if (borderLayer) {
      this.border = borderLayer;
      this.border.setDepth(10);
    }
  }
  clearBorder() {
    this.border?.destroy();
    this.border = null;
  }
  placeCountryTile(x: number, y: number, tint: number, alpha: number) {
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
      return;
    }
    const newTile = this.country.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.tint = tint;
    newTile.alpha = 0.5;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }
  placeLandtile(
    x: number,
    y: number,
    climateName: ClimateName,
    climateSet: number,
    landmass: Formation,
    elevation: number,
    forceColor?: number,
    tint?: { color: number; amount1: number; amount2: number }
  ): number {
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
      return 0x000000;
    }
    const newTile = this.land.putTileAt(0, x, y);
    if (!newTile) return 0x000000;

    const climate = climates.get(climateName);
    if (!climate) return 0x000000;

    newTile.properties = { climate: climateName, landmass, elevation };
    newTile.tint = forceColor ?? climate.colors[climateSet][elevation];
    if (tint)
      newTile.tint = getOverlayColor(
        newTile.tint,
        tint.color,
        tint.amount1,
        tint.amount2
      );

    newTile.alpha = 1;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
    return newTile.tint;
    // this.tint.putTileAt(0, x, y);
  }
  placeAverageTile(x: number, y: number, color1: number, color2: number) {
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
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
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
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
  placeIceTile(x: number, y: number, alpha: number, tint: number) {
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
      return;
    }
    const newTile = this.sea.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.tint = tint;
    newTile.alpha = alpha;
  }
  placeSnowPeak(x: number, y: number) {
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
      return;
    }
    const newTile = this.land.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.alpha = 1;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }
  placeWhiteTile(x: number, y: number, alpha: number, climate: ClimateName) {
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
      return;
    }
    const newTile = this.sea.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.alpha = alpha;

    if (climate === "Mediterranean") {
      newTile.tint = 0x01c6d6;
      newTile.alpha *= 1.5;
    } else if (climate === "Tropical") {
      if (Date.now() % 2 === 0) {
        newTile.tint = 0x34e079;
      } else {
        newTile.tint = 0x28feca;
      }
      newTile.alpha *= 1.25;
    }
    if (oneIn(35)) newTile.alpha *= Math.max(random(4), 1);

    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }
  placeBorder(x: number, y: number, alpha: number, tint?: number) {
    if (!this.border) this.createBorderLayer();
    if (!this.border) return;

    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
      return;
    }
    const newTile = this.border.putTileAt(0, x, y);
    if (!newTile) return;
    newTile.alpha = alpha;
    newTile.tint = tint ?? 0x222222;
    newTile.width = this.scene.pixelScale;
    newTile.height = this.scene.pixelScale;
  }

  placeColoredTile(x: number, y: number, tint: number, alpha: number) {
    if (y < 0 || y > this.scene.mapHeight || x < 0 || x > this.scene.mapWidth) {
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
  clear() {
    this.clearBorder();
    this.land.destroy();
    this.sea.destroy();
    this.country.destroy();
    const seaLayer = this.pixelMap.createBlankLayer(
      "Sea Layer",
      this.pixelTiles,
      0,
      0,
      this.scene.mapWidth,
      this.scene.mapHeight,
      1,
      1
    );

    const landLayer = this.pixelMap.createBlankLayer(
      "Land Layer",
      this.pixelTiles,
      0,
      0,
      this.scene.mapWidth,
      this.scene.mapHeight,
      1,
      1
    );

    const countryLayer = this.pixelMap.createBlankLayer(
      "Country Layer",
      this.pixelTiles,
      0,
      0,
      this.scene.mapWidth,
      this.scene.mapHeight,
      1,
      1
    );

    if (landLayer) this.land = landLayer;
    if (seaLayer) this.sea = seaLayer;
    if (countryLayer) this.country = countryLayer;

    this.sea.setDepth(1);
    this.land.setDepth(2);
    this.country.setDepth(3);

    this.sea.alpha = 0.5;
  }
}
