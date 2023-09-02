import Square from "../Square";

export default function convert(this: Square) {
  for (const [_, neighbor] of this.surroundingSquares()) {
    if (this.landmass.newArrivals.has(neighbor)) return;
    if (neighbor.landmass === this.landmass) continue;
    if (neighbor.landmass.newArrivals.has(this)) continue;
    const convertedMass = neighbor.landmass;
    if (!convertedMass.hasFormed) continue;

    for (const square of neighbor.landmass.landmasses[neighbor.islandIndex]) {
      if (this.landmass.newArrivals.has(square)) continue;
      square.landmass.squares.delete(`${square.y},${square.x}`);
      this.landmass.newArrivals.add(square);
    }

    if (
      neighbor.landmass.landmasses[neighbor.islandIndex].size >
      this.landmass.squares.size
    ) {
      this.landmass.climate = neighbor.landmass.climate;
      this.landmass.name = neighbor.landmass.name;
    }

    if (convertedMass.squares.size === 0) {
      this.scene.formations.delete(convertedMass.name);
    }
  }
}
