import Formation from "../Formation";
export default function showBorder(this: Formation, massIndex: number) {
  for (const square of this.landmasses[massIndex]) {
    if (square.isBorder) {
      this.scene.tilemap.placeBorder(square.x, square.y, 1, 0x222222);
    }
  }
}
