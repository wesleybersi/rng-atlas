// import MainScene from "../../scenes/Main/MainScene";
// import { Cardinal, Direction } from "../../types";
// import { getAdjacentTiles } from "../../utils/helper-functions";
// import { allCardinalsUndefined } from "../../utils/constants";

// type Flow =
//   | "horizontal"
//   | "vertical"
//   | "bothways"
//   | "no-top"
//   | "no-bottom"
//   | "no-left"
//   | "no-right"
//   | "topleft"
//   | "topright"
//   | "bottomleft"
//   | "bottomright";

// class Block extends Phaser.GameObjects.Sprite {
//   scene: MainScene;

//   constructor(
//     scene: MainScene,
//     blockType: "Pipe" | "Block",
//     row: number,
//     col: number
//   ) {
//     super(
//       scene as MainScene,
//       col * scene.cellWidth + scene.cellWidth / 2,
//       row * scene.cellHeight + scene.cellHeight / 2,
//       blockType === "Pipe" ? "pipes" : "blocks",
//       0
//     );
//     this.scene = scene;
//     this.setOrigin(0.5, 0.5);
//     this.name = blockType;
//     this.row = row;
//     this.col = col;
//     this.flow = "horizontal";

//     this.initialPos = {
//       row,
//       col,
//     };

//     this.connectedTo = Object.assign({}, allCardinalsUndefined);
//     this.adjacentLetters = Object.assign({}, allCardinalsUndefined);

//     this.setInteractive();
//     this.on("pointerover", () => {
//       this.scene.events.emit("Pointing at", this);
//     });
//     this.on("pointerout", () => {
//       this.scene.events.emit("Remove from pointer", this);
//     });

//     this.scene.allLetters.set(`${row},${col}`, this);
//     this.update();
//     this.scene.add.existing(this);
//   }

//   isInViewport() {
//     const { viewport } = this.scene;

//     return (
//       this.row >= viewport.startRow &&
//       this.row <= viewport.startRow + viewport.visibleRows &&
//       this.col >= viewport.startCol &&
//       this.col <= viewport.startCol + viewport.visibleCols
//     );
//   }

//   update() {
//     const { allLetters } = this.scene;

//     this.setDepth(this.row);
//     // this.drawShadow();

//     const detectSurroundings = () => {
//       const { top, bottom, right, left } = getAdjacentTiles(this.row, this.col);
//       this.adjacentLetters = {
//         top: allLetters.get(`${top.row},${top.col}`),
//         bottom: allLetters.get(`${bottom.row},${bottom.col}`),
//         right: allLetters.get(`${right.row},${right.col}`),
//         left: allLetters.get(`${left.row},${left.col}`),
//       };

//       if (this.currentFlow) this.waterFlow();

//       for (const [side, connection] of Object.entries(this.connectedTo)) {
//         if (connection && !this.adjacentLetters[side as Cardinal]) {
//           this.connectedTo[side as Cardinal] = undefined;
//           this.autoTile(this.name === "Pipe" ? 2 : 0);
//         }
//       }
//     };

//     if (!this.isMoving) detectSurroundings();
//   }

//   remove(removeAll = true) {
//     if (!this.scene) return;
//     this.scene.events.emit("Remove from pointer", this);

//     const { allLetters } = this.scene;

//     allLetters.delete(`${this.row},${this.col}`);

//     const shape = Array.from(this.shape).filter((part) => part !== this);
//     if (removeAll) shape.forEach((crate) => crate.remove());
//     else {
//       const newColor = generateRandomColor();
//       const updatedShape = new Set<Block>(shape);
//       for (const block of shape) {
//         block.shape = updatedShape;
//         for (const [side, connection] of Object.entries(block.connectedTo)) {
//           if (connection === this) {
//             block.connectedTo[side as Cardinal] = undefined;
//           }
//         }
//         block.update();
//         if (block.name === "Pipe") block.setTint(newColor);
//         block.autoTile(block.name === "Pipe" ? 2 : 0);
//       }
//     }
//     this.shadow?.destroy();
//     this.destroy();
//   }
// }

// export default Block;
