import MainScene from "../../scenes/Main/MainScene";
import { oneIn } from "../../utils/helper-functions";
import Square from "../Square/Square";

const seaReliefColors = [
  0xe3e7f7, 0xe5e9fa, 0xe8ecfd, 0xeaf0ff, 0xecf3ff, 0xf0f5ff, 0xf0f5ff,
  0xedf2ff, 0xeaf0ff, 0xe7eeff, 0xe3ecff, 0xe0eaff, 0xdde8ff, 0xdbe7ff,
  0xd8e6ff, 0xd4e4ff, 0xd1e3ff, 0xcee1ff, 0xcbe0ff, 0xc8deff, 0xc5ddff,
  0xc2dcff, 0xbfdaff, 0xbbd8ff, 0xb8d7ff, 0xb5d5ff, 0xb3d4ff, 0xb0d3ff,
  0xadd1ff, 0xabd0ff, 0xa8ceff, 0xa6cdff, 0xa3ccff, 0xa1caff, 0x9ec9ff,
  0x9cc8ff, 0x99c6ff, 0x97c5ff, 0x94c4ff, 0x92c3ff, 0x90c1ff, 0x8dc0ff,
  0x8bc0ff, 0x89beff, 0x86bdff, 0x84bcff, 0x82bbff, 0x80b9ff, 0x7db8ff,
  0x7bb7ff, 0x79b6ff, 0x77b4ff, 0x75b3ff, 0x73b2ff, 0x71b1ff, 0x6fb0ff,
];

class Ice {
  scene: MainScene;
  y: number;
  x: number;
  depth: number;
  color: number;
  climate: "Polar" | "Subarctic";
  expanded = false;
  isIceBlock = false;
  alpha = Math.max(Math.random() * 0.3, 0.05);
  freeze: number;
  constructor(
    scene: MainScene,
    y: number,
    x: number,
    depth: number,
    climate: "Polar" | "Subarctic",
    isIceBlock?: boolean,
    freeze?: number,
    alpha?: number
  ) {
    this.scene = scene;
    this.y = y;
    this.x = x;
    this.depth = depth;
    this.climate = climate;
    this.color = seaReliefColors[depth];
    this.freeze = freeze ?? 25;

    if (isIceBlock || (climate === "Polar" && oneIn(15))) {
      if (!isIceBlock) this.alpha = Math.random() * 0.65;
      else this.alpha = alpha ?? 0;
      this.isIceBlock = true;
    }

    this.draw();
    if (this.freeze) this.expand();
  }
  draw() {
    this.color = seaReliefColors[this.depth];
    this.scene.tilemap.placeIceTile(this.x, this.y, this.alpha, this.color);
  }

  expand() {
    if (this.expanded) return;
    const positions = {
      top: { y: this.y - 1, x: this.x },
      right: { y: this.y, x: this.x + 1 },
      bottom: { y: this.y + 1, x: this.x },
      left: { y: this.y, x: this.x - 1 },
    };
    const placeIce = () => {
      for (const [_, { x, y }] of Object.entries(positions)) {
        if (
          y < 0 ||
          y > this.scene.mapHeight ||
          x < 0 ||
          x > this.scene.mapWidth
        )
          continue;
        const amount = Math.floor(Math.random() * 5 + 1);

        let newDepth = this.depth + amount;
        if (oneIn(10)) newDepth = Math.max(0, this.depth - 2);

        if (
          !this.scene.tilemap.sea.hasTileAt(x, y) &&
          oneIn(2) &&
          newDepth < seaReliefColors.length - 1
        ) {
          new Ice(
            this.scene,
            y,
            x,
            newDepth,
            this.climate,
            this.isIceBlock,
            this.isIceBlock ? this.freeze - 1 : undefined,
            this.isIceBlock ? this.alpha : undefined
          );
          cancelAnimationFrame(id);
        }
      }
    };
    const id = requestAnimationFrame(placeIce);

    this.expanded = true;
  }
}

export default Ice;
