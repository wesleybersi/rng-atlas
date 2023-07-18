export type ClimateName =
  | "Polar"
  | "Tundra"
  | "Temperate"
  | "Mediterranean"
  | "Rocky"
  | "Tropical"
  | "Arid";

export const climates = new Map<ClimateName, Climate>();

export interface Climate {
  name: ClimateName;
  colors: number[];
}

climates.set("Polar", {
  name: "Polar",
  colors: [
    0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xf7fbfb, 0xeff6f6,
    0xe7f1f1, 0xdfebec, 0xd7e6e6, 0xcfe1e1, 0xc7dbdb, 0xbfd6d6, 0xb7d1d1,
    0xafcccc, 0xa7c7c7, 0x9fc2c2, 0x97bdbd, 0x8fb8b8, 0x87b3b3,
  ],
});

climates.set("Tundra", {
  name: "Tundra",
  colors: [
    0x2b6009, 0x3c700a, 0x4d811b, 0x5e922c, 0x6fa33d, 0x7da842, 0x8bae47,
    0x99b44c, 0xa7ba52, 0xb5bf57, 0xc3c45c, 0xd1ca61, 0xdfcf67, 0xeed46c,
    0xfcd972, 0xfadb77, 0xf8e07c, 0xf6e581, 0xf4ea86, 0xf2ef8c, 0xf0f492,
    0xeef997, 0xedf29c, 0xeaf7a1, 0xe8fca6, 0xe5fcaf, 0xe3fcb8, 0xe0fcc1,
    0x6e5734, 0x8a6e4b, 0xa78562, 0xc39d79, 0xdfb591, 0xfce0c1, 0xfdedd1,
    0xffffff, 0xffffff,
  ],
});

// climates.set("Temperate", {
//   name: "Temperate",
//   colors: [
//     0x3c700a, 0x4d811b, 0x5e922c, 0x6fa33d, 0x7da842, 0x8bae47, 0x99b44c,
//     0xa7ba52, 0xb5bf57, 0xc3c45c, 0xd1ca61, 0xdfcf67, 0xeed46c, 0xfcd972,
//     0xfadb77, 0xf8e07c, 0xf6e581, 0xf4ea86, 0xf2ef8c, 0xf0f492, 0xeef997,
//     0xe4c68a, 0xd9bb82, 0xceaf7b, 0xc3a473, 0xb8976b, 0xac8d64, 0xa1815c,
//     0x9b7c53, 0x8a6b42, 0x795a31, 0x9c9c9c, 0x8b8b8b, 0x7a7a7a, 0x696969,
//     0x585858, 0x474747,
//   ],
// });

// climates.set("Temperate", {
//   name: "Temperate",
//   colors: [
//     0x3c700a, 0x4d811b, 0x5e922c, 0x6fa33d, 0x7da842, 0x8bae47, 0x99b44c,
//     0xa7ba52, 0xb5bf57, 0xc3c45c, 0xd1ca61, 0xdfcf67, 0xeed46c, 0xfcd972,
//     0xfadb77, 0xf8e07c, 0xf6e581, 0xf4ea86, 0xf2ef8c, 0xf0f492, 0xeef997,
//     0xe4c68a, 0xd9bb82, 0xceaf7b, 0xc3a473, 0xb8976b, 0xac8d64, 0xa1815c,
//     0x9b7c53, 0x8a6b42, 0x795a31, 0x9c9c9c, 0x8b8b8b, 0x7a7a7a, 0x696969,
//     0x585858, 0x474747,
//   ],
// });
climates.set("Temperate", {
  name: "Temperate",
  colors: [
    0x6f8341, 0x6c803f, 0x698d3e, 0x668a3d, 0x63873c, 0x60843b, 0x5d813a,
    0x5a7e39, 0x577b38, 0x547835, 0x517534, 0x4e7233, 0x4b6f32, 0x486c31,
    0x456930, 0x42662f, 0x3f632e, 0x3c602d, 0x395d2c, 0x365a2b, 0x335728,
    0x305425, 0x2d5124, 0x2a4e23, 0x274b22, 0x244821, 0x214520, 0x1e421f,
    0x1b3f1e, 0x183c1d, 0x15391c, 0x12361b, 0x0f331a, 0x0c3019, 0x092d18,
  ],
});

climates.set("Mediterranean", {
  name: "Mediterranean",
  colors: [
    0x3c700a, 0x4d811b, 0x5e922c, 0x6fa33d, 0x7da842, 0x8bae47, 0x99b44c,
    0xa7ba52, 0xb5bf57, 0xc3c45c, 0xd1ca61, 0xdfcf67, 0xeed46c, 0xfcd972,
    0xfadb77, 0xf8e07c, 0xf6e581, 0xf4ea86, 0xf2ef8c, 0xf0f492, 0xeef997,
    0xe4c68a, 0xd9bb82, 0xceaf7b, 0xc3a473, 0xb8976b, 0xac8d64, 0xa1815c,
    0x9b7c53, 0x8a6b42, 0x795a31, 0x574920, 0x473810,
  ],
});

climates.set("Tropical", {
  name: "Tropical",
  colors: [
    0x5e922c, 0x6fa33d, 0x79aa3c, 0x83b33c, 0x8dbc3b, 0x97c53b, 0xa1ce3a,
    0xabc83a, 0xb5d139, 0xbfc939, 0xc9d239, 0xd3db38, 0xdde438, 0xe7ed37,
    0xf1f637, 0xfaf436, 0xfaf436, 0xf9ef36, 0xf8e836, 0xf7e236, 0xf1db35,
    0xf1d535, 0xf0ce34, 0xceaf7b, 0xc3a473, 0xb8976b, 0xac8d64, 0xa1815c,
    0x9b7c53, 0x8a6b42, 0x795a31, 0x583810,
  ],
});

climates.set("Rocky", {
  name: "Rocky",
  colors: [
    0x99b44c, 0xb5bf57, 0xc3c45c, 0xd1ca61, 0xf2ef8c, 0xe4c68a, 0xd9bb82,
    0xceaf7b, 0xc3a473, 0xb8976b, 0xac8d64, 0xa1815c, 0x9b7c53, 0x8a6b42,
    0x795a31, 0x9c9c9c, 0x8b8b8b, 0x7a7a7a, 0x696969, 0x585858, 0x474747,
  ],
});

climates.set("Arid", {
  name: "Arid",
  colors: [
    0xb7b090, 0xc4ba98, 0xd2c3a0, 0xdfcda8, 0xedd6b1, 0xfadfb9, 0xf7e8c1,
    0xf4f0ca, 0xf1f9d2, 0xf0f8d2, 0xeef7d1, 0xedf6d0, 0xecf5ce, 0xebf4cd,
    0xe9f3cc, 0xe8f2cb, 0xe7f1ca, 0xe6f0c8, 0xe4efc7, 0xe3eec6, 0xe2edc5,
    0xe1ecc4, 0xdfebc2, 0xdeead1, 0xddeddc, 0xb3a473, 0xa8976b, 0x9c8d64,
    0x91815c, 0x8b7c53, 0x7a6b42, 0x695a31, 0x474920, 0x373810,
  ],
});

export const climateKeys = Array.from(climates.keys()) as ClimateName[];