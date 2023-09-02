// import { oneIn, random } from "../../../utils/helper-functions";
// import MainScene from "../MainScene";

// export default function oceanGrading(
//   scene: MainScene,
//   start: { x: number; y: number }
// ) {
//   const initialSet: Set<{ x: number; y: number }> = new Set();
//   let initialSize = random(5000);

//   function create(x: number, y: number) {
//     const surroundings = {
//       top: { y: y - 1, x },
//       right: { y, x: x + 1 },
//       bottom: { y: y + 1, x },
//       left: { y, x: x - 1 },
//     };

//     for (const [_, { x, y }] of Object.entries(surroundings).sort(
//       () => Math.random() - 0.5
//     )) {
//       if (initialSet.size >= initialSize) break;
//       if (oneIn(2)) {
//         initialSet.add({ x, y });
//         initialSize--;
//         create(x, y);
//       }
//     }
//   }
//   create(start.x, start.y);

//   const expand = (
//     id: number,
//     set: Set<{ x: number; y: number }>,
//     depth: number,
//     iteration = 0,
//     includedSet: Set<string> = new Set()
//   ) => {
//     const newSet: Set<{ x: number; y: number }> = new Set();
//     for (const square of set) {
//       const surroundings = {
//         top: { y: square.y - 1, x: square.x },
//         right: { y: square.y, x: square.x + 1 },
//         bottom: { y: square.y + 1, x: square.x },
//         left: { y: square.y, x: square.x - 1 },
//       };
//       if (oneIn(3)) continue;
//       for (const [_, { x, y }] of Object.entries(surroundings).sort(
//         () => Math.random() - 0.5
//       )) {
//         if (includedSet.has(`${x},${y}`)) {
//           continue;
//         }
//         let overrule = undefined;
//         const tileInPlace = scene.tilemap.sea.getTileAt(x, y);
//         if (tileInPlace) overrule = (depth + tileInPlace.alpha) / 2;

//         scene.tilemap.placeWhiteTile(x, y, overrule ?? depth,);
//         newSet.add({ x, y });
//         includedSet.add(`${x},${y}`);
//       }
//     }

//     if (!oneIn(4)) depth -= 0.005;
//     else depth += 0.005;

//     if (depth > 0)
//       requestAnimationFrame(() =>
//         expand(id, newSet, depth, (iteration += 1), includedSet)
//       );
//     else {
//       return cancelAnimationFrame(id);
//     }
//   };
//   const depths = requestAnimationFrame(() => expand(depths, initialSet, 0.15));
// }
