import MainScene from "../../../scenes/Main/MainScene";
import Square from "../Square";

// export function eraseWithinRadius(this: Square, radius: number) {
//   const selection = new Set<Square>();

//   const leftX = this.x - radius;
//   const rightX = this.x + radius;
//   const topY = this.y - radius;
//   const bottomY = this.y + radius;

//   for (let x = leftX; x <= rightX; x++) {
//     for (let y = topY; y <= bottomY; y++) {
//       const distanceSquared = (x - this.x) ** 2 + (y - this.y) ** 2;
//       if (distanceSquared <= radius * radius) {
//         const square = this.scene.occupiedLand.get(`${x},${y}`);
//         if (square) square.remove();
//       }
//     }
//   }

//   return selection;
// }
