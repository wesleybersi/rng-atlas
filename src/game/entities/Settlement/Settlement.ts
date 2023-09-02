import MainScene from "../../scenes/Main/MainScene";
import Formation from "../Formation/Formation";
import Square from "../Square/Square";

class Settlement extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  x: number;
  y: number;
  text: Phaser.GameObjects.Text;
  name: string;
  description: string[];
  type: "Village" | "City" | "Capital";
  square!: Square;
  constructor(
    scene: MainScene,
    type: number,
    icon: string,
    name: string,
    description: string[],
    population: number,
    x: number,
    y: number
  ) {
    super(scene, x, y, "settlements", type);
    this.scene = scene;
    this.y = y;
    this.x = x;
    this.setOrigin(0.5, 0.5);
    this.name = name;
    this.description = description;
    if (type === 0) this.type = "Village";
    else if (type === 1) this.type = "City";
    else if (type === 2) this.type = "Capital";
    else this.type = "Village";
    this.text = this.scene.add.text(
      Math.floor(this.x),
      Math.floor(this.y + 1),
      this.name,
      {
        fontFamily: "font1",
      }
    );
    this.text.setFontSize(0);
    this.text.autoRound = false;
    this.setDepth(8);
    this.text.setOrigin(0.5, 0);
    this.text.setDepth(8);

    if (this.scene.hideSettlements) this.hide();
    else this.show();

    console.log(name, "has been settled");

    const square = this.scene.occupiedLand.get(`${x},${y}`);
    if (square) this.square = square;

    this.scene.add.existing(this);
  }
  hide() {
    this.alpha = 0;
    this.text.alpha = 0;
  }
  show() {
    this.alpha = 0.85;
    this.text.alpha = 1;
  }
  remove() {
    this.text.destroy();
    this.destroy();
  }
}
export default Settlement;
