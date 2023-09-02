import climates, { ClimateName, climateKeys } from "../../GeoMap/land/climates";
import Square from "../../Square/Square";
import Formation from "../Formation";

export default function seperateMass(this: Formation) {
  const squares = new Map([...this.squares]);
  const climateCounts: {
    name: ClimateName;
    count: number;
  }[] = Array.from(climateKeys).map((key, index) => ({
    name: key,
    count: 0,
  }));
  const positions = new Set<string>();

  const newIsland = (
    startSquare: Square,
    island: Set<Square>,
    index: number
  ): Set<Square> => {
    const stack = [startSquare];

    while (stack.length > 0) {
      const square = stack.pop();
      if (!square || positions.has(`${square.y},${square.x}`)) continue;
      const climate = climateCounts.find(
        ({ name }) => name === square.climate.name
      );
      if (climate) climate.count++;

      island.add(square);
      squares.delete(`${square.y},${square.x}`);
      square.islandIndex = index;
      positions.add(`${square.y},${square.x}`);

      for (const [_, { x, y }] of Object.entries(square.surroundings)) {
        const nextSquare = this.squares.get(`${y},${x}`);
        if (nextSquare && !island.has(nextSquare)) {
          stack.push(nextSquare);
        }
      }
    }

    return island;
  };

  const nextSquare = (): void => {
    for (const [_, square] of squares) {
      if (!square || positions.has(`${square.y},${square.x}`)) continue;
      const island = newIsland(square, new Set(), this.landmasses.length);
      this.landmasses.push(island);
    }
  };

  this.landmasses = [];
  nextSquare();

  for (const island of this.landmasses) {
    if (island.size <= 5) {
      for (const square of island) {
        square.remove();
      }
      continue;
    }
    //TODO New Landmass

    this.addShoreline(this.landmasses.indexOf(island));
  }

  const current = { climate: this.climate, count: 0 };
  for (const climate of climateCounts) {
    if (climate.count > current.count) {
      current.count = climate.count;
      current.climate = climates.get(climate.name) ?? this.climate;
    }
  }
  this.climate = current.climate;
}
