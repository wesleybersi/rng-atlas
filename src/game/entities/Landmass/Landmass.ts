import MainScene from "../../scenes/Main/MainScene";
import { Cardinal, Connection, Direction, SquarePosition } from "../../types";
import { getOppositeSide } from "../../utils/helper-functions";
import { Territory } from "../../scenes/Main/MainScene";
import SeaSquare from "../SeaSquare/SeaSquare";
import Ice from "../Ice/Ice";

class Landmass {
  scene: MainScene;
  constructor(scene: MainScene) {
    this.scene = scene;
  }
}

export default Landmass;
