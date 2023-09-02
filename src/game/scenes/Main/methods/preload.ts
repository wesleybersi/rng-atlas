import MainScene from "../MainScene";
import imagePixel from "../../../assets/pixel.png";
import imageSettlements from "../../../assets/settlements.png";

export default function preload(this: MainScene) {
  this.scene.launch("Loading", this);
  console.log("Main: Preload");
  //Tilesets

  this.load.spritesheet("settlements", imageSettlements, {
    frameWidth: 9,
    frameHeight: 9,
  });
  this.load.spritesheet("pixel", imagePixel, {
    frameWidth: 1,
    frameHeight: 1,
  });
}
