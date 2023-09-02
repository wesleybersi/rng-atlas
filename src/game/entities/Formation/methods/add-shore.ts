import { oneIn, random } from "../../../utils/helper-functions";
import Formation from "../Formation";

export default function addShore(this: Formation, massIndex: number) {
  const initialSet: Set<{ x: number; y: number }> = new Set();
  for (const square of Array.from(this.landmasses[massIndex])) {
    if (square.isBorder) initialSet.add({ x: square.x, y: square.y });
  }
  const interval = Math.max(random(9), 3);

  const expand = (
    id: number,
    set: Set<{ x: number; y: number }>,
    depth: number,
    iteration = 0,
    includedSet: Set<string> = new Set()
  ) => {
    const newSet: Set<{ x: number; y: number }> = new Set();
    for (const square of set) {
      const surroundings = {
        top: { y: square.y - 1, x: square.x },
        right: { y: square.y, x: square.x + 1 },
        bottom: { y: square.y + 1, x: square.x },
        left: { y: square.y, x: square.x - 1 },
      };
      if (oneIn(3)) continue;
      for (const [_, { x, y }] of Object.entries(surroundings).sort(
        () => Math.random() - 0.5
      )) {
        if (includedSet.has(`${x},${y}`)) {
          continue;
        }
        let overrule = undefined;
        const tileInPlace = this.scene.tilemap.sea.getTileAt(x, y);
        if (tileInPlace) overrule = (depth + tileInPlace.alpha) / 2;

        if (iteration % (interval - 1) === 0) overrule = depth * 1.25;
        if (iteration % interval === 0) overrule = depth * 1.75;
        if (iteration % (interval + 1) === 0) overrule = depth * 1.25;

        this.scene.tilemap.placeWhiteTile(
          x,
          y,
          iteration < 2 ? 0 : overrule ?? depth + Math.random() * 0.02,
          this.climate.name
        );
        newSet.add({ x, y });
        includedSet.add(`${x},${y}`);
      }
    }

    if (!oneIn(4)) depth -= 0.01;
    else depth += 0.0075;

    if (depth > 0)
      requestAnimationFrame(() =>
        expand(id, newSet, depth, (iteration += 1), includedSet)
      );
    else {
      return cancelAnimationFrame(id);
    }
  };
  const depths = requestAnimationFrame(() => expand(depths, initialSet, 0.1));
}
