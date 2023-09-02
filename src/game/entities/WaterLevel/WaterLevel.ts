import { request } from "http";
import MainScene from "../../scenes/Main/MainScene";
import Formation from "../Formation/Landmass";
import Square from "../Square/Square";
import { oneIn } from "../../utils/helper-functions";

class WaterLevel extends Phaser.GameObjects.Image {
  scene: MainScene;
  x: number;
  y: number;
  surroundings: {
    top: { x: number; y: number };
    left: { x: number; y: number };
    bottom: { x: number; y: number };
    right: { x: number; y: number };
  };
  amount: number;

  square!: Square;
  set: Set<string>;
  constructor(
    scene: MainScene,
    x: number,
    y: number,
    amount: number,
    set: Set<string>
  ) {
    super(scene, x, y, "pixel", 0);
    this.scene = scene;
    this.y = y;
    this.x = x;
    this.surroundings = {
      top: { y: this.y - 1, x: this.x },
      right: { y: this.y, x: this.x + 1 },
      bottom: { y: this.y + 1, x: this.x },
      left: { y: this.y, x: this.x - 1 },
    };

    this.setDepth(10);
    this.alpha = 0.1;
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 250,
      ease: "Sine",
    });
    this.amount = amount;
    this.set = set;
    this.set.add(`${x},${y}`);
    this.scene.add.existing(this);

    if (this.set.size > 25000 || amount <= 0) return;
    requestAnimationFrame(() => this.expand());
  }
  expand() {
    for (const [_, { x, y }] of Object.entries(this.surroundings).sort(
      () => Math.random() - 0.5
    )) {
      //   if (oneIn(2)) continue;
      if (this.set.has(`${x},${y}`)) continue;

      const square = this.scene.occupiedLand.get(`${x},${y}`);
      if (square) {
        square.remove();
        this.alpha = 0;
        for (const [side, neighbor] of square.surroundingSquares()) {
          const surroundings = neighbor.surroundingSquares();
          if (surroundings.size < 4) neighbor.isBorder;
        }
      }
      new WaterLevel(
        this.scene,
        x,
        y,
        square ? this.amount - 1 : this.amount,
        this.set
      );
    }
  }
}
export default WaterLevel;
