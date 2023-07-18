import Square from "../../../entities/Square/Square";
import MainScene from "../MainScene";
import GeoMap from "../../../entities/GeoMap/GeoMap";
import Landmass from "../../../entities/Landmass/Landmass";
import randomClimate from "../../../entities/Landmass/helper/climate";
import generateRandomCountryName from "../../../entities/Landmass/helper/random-name";
import { random } from "../../../utils/helper-functions";
import { seaBg, seaColors } from "../../../entities/GeoMap/sea/colors";

export default function create(this: MainScene, data: any) {
  //ANCHOR React <--> Phaser
  this.reactEvents = data.emitter;
  this.reactEventListener();

  const worldWidth = this.colCount;
  const worldHeight = this.rowCount;

  //ANCHOR Camera
  const camera = this.cameras.main;

  camera.setBackgroundColor(seaBg[random(seaBg.length)]);

  camera.setBounds(0, 0, worldWidth, worldHeight);
  camera.zoom = this.playZoomLevel;
  camera.roundPixels = true;

  this.grid = this.add.grid(
    0,
    0,
    this.colCount * 2,
    this.rowCount * 2,
    64,
    64,
    undefined,
    0,
    0xffffff,
    0.05
  );

  this.grid.setStrokeStyle(1, 0xffffff);
  this.grid.scale = 0.5;
  this.grid.setOrigin(0, 0);

  this.tilemap = new GeoMap(this);

  //ANCHOR Pointer events
  this.input.mouse?.disableContextMenu();
  this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    this.hover.x = Math.floor(pointer.worldX);
    this.hover.y = Math.floor(pointer.worldY);

    this.hover.zoomLock = null;

    if (pointer.rightButtonDown()) {
      camera.scrollX -= (pointer.x - pointer.prevPosition.x + 1) / camera.zoom;
      camera.scrollY -= (pointer.y - pointer.prevPosition.y + 1) / camera.zoom;
      return;
    }

    let hasObject = false;
    this.events.emit(
      `${this.hover.y},${this.hover.x}`,
      "Ping",
      (object: Square) => {
        if (object) {
          if (!object.landmass.hasFormed) return;
          hasObject = true;
          this.hover.z = object.elevation;

          this.hover.landmass = object.landmass;

          if (this.client.tool === "Blur") {
            if (pointer.isDown) {
              object.merge(random(25));
            }
          }
        }
      }
    );

    if (!hasObject) {
      if (this.hover.landmass) {
        // this.hover.landmass.hideBorder(
        //   this.pixelScale === 1 && this.hover.landmass.hasFormed
        //     ? true
        //     : undefined
        // );
        this.hover.landmass = null;
      }
      this.hover.z = 0;
    }
    this.reactEvents?.emit("Hover Update", this.hover);
  });
  // this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
  //   if (!pointer.rightButtonDown()) {
  //     this.cameras.main.pan(pointer.worldX, pointer.worldY, 500, "Sine");
  //   }
  // });

  this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    // if (pointer.rightButtonDown()) {
    //   this.events.emit(
    //     `${this.hover.y},${this.hover.x}`,
    //     "Ping",
    //     (object: Square) => {
    //       if (object) {
    //         // object.subtract(Math.max(random(4), 2));
    //         object.formRiver();
    //         // object.landmass.defineIslands();
    //       }
    //     }
    //   );
    //   return;
    // }
    switch (this.client.tool) {
      case "Pointer":
        if (pointer.rightButtonDown()) {
          this.selected.landmass?.hideBorder(true);
          this.selected.landmass = null;
          this.selected.islandIndex = null;
        } else {
          this.selected.landmass?.hideBorder(true);
          this.selected.landmass = this.hover.landmass;
        }
        if (this.selected) {
          this.events.emit(
            `${this.hover.y},${this.hover.x}`,
            "Ping",
            (object: Square) => {
              if (object) {
                this.selected.landmass?.showBorder(object.islandIndex);
                this.selected.islandIndex = object.islandIndex;
              }
            }
          );
        }
        this.reactEvents?.emit("New Selection", this.selected);
        break;
      case "Expand":
        if (this.hover.landmass) {
          const square = this.hover.landmass.squares.get(
            `${this.hover.y},${this.hover.x}`
          );
          if (!square) return;
          const index = square.islandIndex;

          this.hover.landmass.hideShoreLine();
          this.hover.landmass.targetExpanse = this.client.maxTargetSize;
          console.log(this.hover.landmass.targetExpanse);
          this.hover.landmass.priority = true;
          this.hover.landmass.expandMass(square.islandIndex);
          return;
        }
        break;
      case "Blur":
        return;
      case "Diminish":
        if (this.hover.landmass) {
          const square = this.hover.landmass.squares.get(
            `${this.hover.y},${this.hover.x}`
          );
          if (!square) return;
          this.hover.landmass.hideShoreLine();
          this.hover.landmass.targetExpanse = this.client.maxTargetSize;
          this.hover.landmass.priority = true;
          this.hover.landmass.diminishMass(square.islandIndex);
          return;
        }
        break;
      case "Remove":
        if (this.hover.landmass) {
          const square = this.hover.landmass.squares.get(
            `${this.hover.y},${this.hover.x}`
          );
          if (!square) return;
          this.hover.landmass.hideShoreLine();
          this.hover.landmass.targetExpanse = this.client.maxTargetSize;
          this.hover.landmass.priority = true;
          this.hover.landmass.removeMass(square.islandIndex);
          return;
        }
        break;
      case "Generate":
        {
          if (pointer.rightButtonDown()) return;
          if (this.hover.landmass) return;
          const targetSize = this.client.maxTargetSize;
          const newIsland = new Landmass(
            this,
            generateRandomCountryName(),
            { x: this.hover.x, y: this.hover.y, elevation: random(10) },
            new Map(),
            targetSize,
            this.client.climate
            // randomClimate(this, this.hover.x, this.hover.y)
          );
          newIsland.priority = true;
          newIsland.expandMass();
        }
        break;
      case "River Tool": {
        this.events.emit(
          `${this.hover.y},${this.hover.x}`,
          "Ping",
          (object: Square) => {
            if (object) {
              object.formRiver(undefined, this.client.maxTargetSize);
            }
          }
        );
      }
    }
  });

  let hasObject = this.hover.landmass ? true : false;
  this.events.emit(
    `${this.hover.y},${this.hover.x}`,
    "Ping",
    (object: Square) => {
      if (object) {
        hasObject = true;
      }
    }
  );
  if (hasObject) return;

  //ANCHOR Keyboard events
  this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
    switch (event.key) {
      case "PageUp":
        if (this.playZoomLevel < 10) this.playZoomLevel++;
        this.cameras.main.zoom = this.playZoomLevel;
        break;
      case "PageDown":
        if (this.playZoomLevel > 1) this.playZoomLevel--;
        this.cameras.main.zoom = this.playZoomLevel;
        break;
      case "Home":
        this.playZoomLevel = 3;
        this.cameras.main.zoom = this.playZoomLevel;
        break;
      case "Meta":
        this.buttons.meta = true;
        break;

      case "=":
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
        break;
    }
  });
  this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
    switch (event.key) {
      case "Meta":
        this.buttons.meta = false;
        break;
    }
  });

  this.input.on(
    "wheel",
    (pointer: Phaser.Input.Pointer) => {
      const prevZoom = camera.zoom;
      if (pointer.deltaY < 0) {
        camera.zoom *= 1.1;
      } else if (pointer.deltaY > 0) {
        camera.zoom /= 1.1;
        if (camera.zoom <= 2) camera.zoom = 2;
      }

      camera.pan(pointer.worldX, pointer.worldY, 0, "Sine");

      if (prevZoom > 2 && camera.zoom < 2) {
        for (const [_, landmass] of this.landmasses) {
          this.pixelScale = 2;
          landmass.redraw();
        }
        return;
      } else if (prevZoom < 2 && camera.zoom > 2) {
        for (const [_, landmass] of this.landmasses) {
          this.pixelScale = 1;
          landmass.redraw();
        }
        return;
      }
    },
    this
  );
  this.reactEvents?.emit("Client Update", this.client);
  // this.cameras.main.fadeIn(1000);
}
