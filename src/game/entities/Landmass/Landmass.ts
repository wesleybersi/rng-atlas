import MainScene from "../../scenes/Main/MainScene";
import Country from "../Country/Country";
import generateRandomCountryName from "../Formation/helper/random-name";
import Square from "../Square/Square";

export default class Landmass {
  scene: MainScene;
  name = generateRandomCountryName();
  squares = new Set<Square>();
  countries = new Set<Country>();
  constructor(scene: MainScene) {
    this.scene = scene;
  }
}
