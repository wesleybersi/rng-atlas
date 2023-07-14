import MainScene from "../MainScene";
import imagePixel from "../../../assets/pixel.png";

export default function preload(this: MainScene) {
  this.scene.launch("Loading", this);
  console.log("Main: Preload");
  //Tilesets
  this.load.image("pixel", imagePixel);
}
