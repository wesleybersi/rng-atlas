import Formation from "../Formation";

export default function addNewArrivals(this: Formation) {
  for (const square of this.newArrivals) {
    this.squares.set(`${square.y},${square.x}`, square);
    square.landmass = this;
  }
  this.newArrivals.clear();
  this.seperateMass();
}
