import MainScene from "../../scenes/Main/MainScene";
import { Connection, SquarePosition } from "../../types";

class Rail extends Phaser.GameObjects.Sprite {
  scene: MainScene;
  row: number;
  col: number;
  connections: Map<SquarePosition, Connection>;
  lines: Phaser.GameObjects.Line[] = [];
  constructor(
    scene: MainScene,
    row: number,
    col: number,
    connections: Map<SquarePosition, Connection>
  ) {
    super(
      scene as MainScene,
      col * scene.cellWidth + scene.cellWidth / 2,
      row * scene.cellHeight + scene.cellHeight / 2,
      ""
    );

    this.setOrigin(0.5, 0.5);
    this.alpha = 0;
    this.scene = scene;
    this.row = row;
    this.col = col;
    this.connections = connections;

    scene.add.existing(this);

    console.log("New rail at", "Row:", row, "Col:", col);

    //Event listener listening to specific event
    this.scene.events.on(
      `${row},${col}`,
      (eventType: string, callback?: (object: unknown) => void) => {
        console.log("Event:", eventType, "at", "Row:", row, "Col:", col);

        switch (eventType) {
          case "Ping":
            if (callback) callback(this);
            break;
          case "Release":
            {
              let removeMe = true;
              for (const [position, connection] of this.connections) {
                if (connection) removeMe = false;
              }
              if (removeMe) this.remove();
            }
            break;
          case "Remove":
            this.remove();

            break;
          case "CargoIn":
            break;
          case "CargoOut":
            break;
        }
      },
      this
    );
    this.draw();
  }
  draw() {
    for (const line of this.lines) {
      line.destroy();
    }
    const { cellWidth, cellHeight } = this.scene;
    for (const [position, connection] of this.connections) {
      switch (position) {
        case "Right":
          {
            const newLine = this.scene.add.line(
              this.x,
              this.y,
              cellWidth / 2,
              0,
              0,
              0,
              0x4466ff,
              1
            );
            newLine.setOrigin(0, 0);
            newLine.setLineWidth(2);
            this.lines.push(newLine);
          }
          break;
        case "Left":
          {
            const newLine = this.scene.add.line(
              this.x,
              this.y,
              -cellWidth / 2,
              0,
              0,
              0,
              0x4466ff,
              1
            );
            newLine.setOrigin(0, 0);
            newLine.setLineWidth(2);
            this.lines.push(newLine);
          }
          break;
        case "Top":
          {
            const newLine = this.scene.add.line(
              this.x,
              this.y,
              0,
              -cellHeight / 2,
              0,
              0,
              0x4466ff,
              1
            );
            newLine.setOrigin(0, 0);
            newLine.setLineWidth(2);
            this.lines.push(newLine);
          }
          break;
        case "Bottom":
          {
            const newLine = this.scene.add.line(
              this.x,
              this.y,
              0,
              cellHeight / 2,
              0,
              0,
              0x4466ff,
              1
            );
            newLine.setOrigin(0, 0);
            newLine.setLineWidth(2);
            this.lines.push(newLine);
          }
          break;
        case "TopRight":
          {
            const newLine = this.scene.add.line(
              this.x,
              this.y,
              cellWidth / 2,
              -cellHeight / 2,
              0,
              0,
              0x4466ff,
              1
            );
            newLine.setOrigin(0, 0);
            newLine.setLineWidth(2);
            this.lines.push(newLine);
          }
          break;
        case "TopLeft":
          {
            const newLine = this.scene.add.line(
              this.x,
              this.y,
              -cellWidth / 2,
              -cellHeight / 2,
              0,
              0,
              0x4466ff,
              1
            );
            newLine.setOrigin(0, 0);
            newLine.setLineWidth(2);
            this.lines.push(newLine);
          }
          break;
        case "BottomRight":
          {
            const newLine = this.scene.add.line(
              this.x,
              this.y,
              cellWidth / 2,
              cellHeight / 2,
              0,
              0,
              0x4466ff,
              1
            );
            newLine.setOrigin(0, 0);
            newLine.setLineWidth(2);
            this.lines.push(newLine);
          }
          break;
        case "BottomLeft":
          {
            const newLine = this.scene.add.line(
              this.x,
              this.y,
              -cellWidth / 2,
              cellHeight / 2,
              0,
              0,
              0x4466ff,
              1
            );
            newLine.setOrigin(0, 0);
            newLine.setLineWidth(2);
            this.lines.push(newLine);
          }
          break;
      }
    }
  }
  remove() {
    for (const line of this.lines) {
      line.destroy();
    }

    for (const [position, connection] of this.connections) {
      this.scene.events.emit(
        `${connection.connectedTo.row},${connection.connectedTo.col}`,
        "Ping",
        (object: unknown) => {
          if (object && object instanceof Rail) {
            for (const [pos, con] of object.connections) {
              if (
                con.connectedTo.row === this.row &&
                con.connectedTo.col === this.col
              ) {
                console.log("EEE");
                object.connections.delete(pos);
                object.draw();
              }
            }
          }
        }
      );
    }

    this.scene.events.removeListener(`${this.row},${this.col}`);
    this.destroy();
  }
}

export default Rail;
