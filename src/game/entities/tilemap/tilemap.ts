// import MainScene from "../../scenes/Main/MainScene";

// export default class BasicTilemap {
//   scene: MainScene;
//   pixelMap: Phaser.Tilemaps.Tilemap;
//   pixelTiles!: Phaser.Tilemaps.Tileset;
//   land!: Phaser.Tilemaps.TilemapLayer;
//   sea!: Phaser.Tilemaps.TilemapLayer;
//   constructor(scene: MainScene) {
//     this.scene = scene as MainScene;

//     //The map keeping track of all the layers
//     this.pixelMap = scene.make.tilemap({
//       tileWidth: scene.cellWidth,
//       tileHeight: scene.cellHeight,
//       width: scene.colCount,
//       height: scene.rowCount,
//     });

//     const pixelTiles = this.pixelMap.addTilesetImage("pixel");
//     if (pixelTiles) this.pixelTiles = pixelTiles;

//     const seaLayer = this.pixelMap.createBlankLayer(
//       "Base Layer",
//       this.pixelTiles,
//       0,
//       0,
//       scene.colCount,
//       scene.rowCount,
//       1,
//       1
//     );

//     const landLayer = this.pixelMap.createBlankLayer(
//       "Base Layer",
//       this.pixelTiles,
//       0,
//       0,
//       scene.colCount,
//       scene.rowCount,
//       1,
//       1
//     );

//     if (landLayer) this.land = landLayer;
//     if (seaLayer) this.sea = seaLayer;

//     this.land.setDepth(0);
//     this.placeInitialTiles();
//   }
//   placeEmptyFloorTile(col: number, row: number) {
//     const newTile = this.land.putTileAt(1, col, row);
//     newTile.setCollision(false, false, false, false);
//     newTile.properties = { name: "Empty" };
//     newTile.alpha = 0.65;
//   }
//   placeSeaTile() {}

//   placeInitialTiles() {
//     this.sea.forEachTile((tile) => {
//       this.placeEmptyFloorTile(tile.x, tile.y);
//     });
//   }
// }
