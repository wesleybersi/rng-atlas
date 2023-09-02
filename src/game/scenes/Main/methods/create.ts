import Square from "../../../entities/Square/Square";
import MainScene from "../MainScene";

import Formation from "../../../entities/Formation/Formation";

import generateRandomCountryName from "../../../entities/Formation/helper/random-name";
import { oneIn, random } from "../../../utils/helper-functions";
import { seaBg, seaColors } from "../../../entities/GeoMap/sea/colors";
import climates from "../../../entities/GeoMap/land/climates";

export default function create(this: MainScene, data: any) {
  //ANCHOR React <--> Phaser
  this.reactEvents = data.emitter;
  this.reactEventListener();

  //ANCHOR Camera
  const camera = this.cameras.main;

  camera.setBackgroundColor(seaBg[random(seaBg.length)]);
  camera.setBackgroundColor(0x11314e);
  camera.setBackgroundColor(0x125f75);

  camera.zoom = 3;

  camera.setRoundPixels(true);

  //ANCHOR Pointer events
  this.input.mouse?.disableContextMenu();
  this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    this.hover.x = Math.floor(pointer.worldX);
    this.hover.y = Math.floor(pointer.worldY);

    if (pointer.rightButtonDown()) {
      const camera = this.cameras.main;
      const deltaX = (pointer.x - pointer.prevPosition.x) / camera.zoom;
      const deltaY = (pointer.y - pointer.prevPosition.y) / camera.zoom;

      // Convert the deltas to the camera's coordinate system
      const angle = Phaser.Math.DegToRad(this.client.rotation);
      const newDeltaX = deltaX * Math.cos(angle) - deltaY * Math.sin(angle);
      const newDeltaY = deltaX * Math.sin(angle) + deltaY * Math.cos(angle);

      // Update the camera position to pan
      camera.scrollX -= newDeltaX;
      camera.scrollY -= newDeltaY;
    }

    const square = this.occupiedLand.get(`${this.hover.x},${this.hover.y}`);

    if (square) {
      if (!square.landmass.hasFormed) return;
      this.hover.z = square.elevation;
      this.hover.formation = square.landmass;
      this.hover.country = square.country;
    } else if (!square) {
      if (this.hover.formation) {
        this.hover.formation = null;
      }
      if (this.hover.country) {
        this.hover.country = null;
      }
      this.hover.z = 0;
    }
    this.reactEvents?.emit("Hover Update", this.hover);
  });
  this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
    if (this.eraser.landmasses.size > 0) {
      console.log(this.eraser.landmasses);
      for (const landmass of this.eraser.landmasses) {
        landmass.defineIslands();
      }
      this.eraser.landmasses.clear();
      return;
    }
    if (this.isDragging) {
      const landmasses: Set<Formation> = new Set();

      for (const movingSquare of this.isDragging.squares) {
        const tile = this.tilemap.land.putTileAt(
          0,
          movingSquare.x,
          movingSquare.y
        );
        tile.tint = movingSquare.color;
        movingSquare.updateSurroundings();

        const squareInPlace = this.occupiedLand.get(
          `${movingSquare.x},${movingSquare.y}`
        );
        if (squareInPlace) {
          landmasses.add(squareInPlace.landmass);
          if (squareInPlace.landmass !== movingSquare.landmass) {
            for (const square of movingSquare.landmass.landmasses[
              movingSquare.islandIndex
            ]) {
              square.landmass.squares.delete(`${square.y},${square.x}`);
              square.landmass = squareInPlace.landmass;
              square.landmass.squares.set(`${square.y},${square.x}`, square);
            }
          }
          squareInPlace.remove();
        }

        this.occupiedLand.set(
          `${movingSquare.x},${movingSquare.y}`,
          movingSquare
        );

        movingSquare.merge(random(100), tile.tint, 1);
      }
      for (const landmass of landmasses) {
        console.log("Landmass:", landmass);
        landmass.defineIslands();
      }
    }
    this.isDragging = null;
  });

  this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    if (!pointer.rightButtonDown()) this.tilemap.clearBorder();
    switch (this.client.tool) {
      case "Pointer":
        if (pointer.rightButtonDown()) {
          // if (this.selected.landmass && this.selected.islandIndex !== null) {
          //   this.tilemap.clearBorder();
          // }
          // this.selected.landmass = null;
          // this.selected.islandIndex = null;
          return;
        } else {
          if (this.selected.formation && this.selected.massIndex !== null) {
            this.tilemap.clearBorder();
          }
          this.selected.formation = this.hover.formation;
          this.selected.country = this.hover.country;
        }
        if (this.client.selectMode === "Landmass") {
          if (this.selected.formation) {
            const square = this.occupiedLand.get(
              `${this.hover.x},${this.hover.y}`
            );
            if (square) {
              this.selected.formation?.showBorder(square.islandIndex);
              this.selected.massIndex = square.islandIndex;
            }
          }
        } else if (this.client.selectMode === "Country") {
          if (this.selected.country) {
            this.selected.country.showBorder();
          }
        }

        this.reactEvents?.emit("New Selection", this.selected);

        break;

      case "Generate":
        {
          if (pointer.rightButtonDown()) {
            const square = this.occupiedLand.get(
              `${this.hover.x},${this.hover.y}`
            );
            if (!square) return;
            if (!square.landmass.hasFormed) square.landmass.forceFinish = true;
            return;
          }

          if (this.hover.formation) {
            const square = this.occupiedLand.get(
              `${this.hover.x},${this.hover.y}`
            );
            if (!square) return;

            this.hover.formation.hideShoreLine(square.islandIndex);
            // this.hover.landmass.targetExpanse = this.client.maxTargetSize;
            this.hover.formation.priority = true;
            this.hover.formation.form(
              square.islandIndex,
              this.client.maxTargetSize
            );
            return;
          }

          const climate = climates.get(this.client.climate);
          if (!climate) return;
          const newIsland = new Formation(
            this,
            generateRandomCountryName(),
            { x: this.hover.x, y: this.hover.y, elevation: random(10) },
            new Map(),
            climate
          );
          newIsland.priority = true;
          newIsland.form(undefined, this.client.maxTargetSize);
        }
        break;
    }
  });

  let hasObject = this.hover.formation ? true : false;
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
      case "PageUp": {
        if (camera.zoom >= 10) break;
        this.tweens.add({
          targets: camera,
          zoom: Math.ceil(camera.zoom + 1),
          duration: 500,
          ease: "Sine.easeInOut",
        });
        break;
      }
      case "PageDown": {
        if (camera.zoom <= 1) break;
        this.tweens.add({
          targets: camera,
          zoom: Math.floor(camera.zoom - 1),
          duration: 500,
          ease: "Sine.easeInOut",
        });
        break;
      }
      case "Home":
        camera.zoom = 3;
        break;
      case "Meta":
        this.buttons.meta = true;
        break;
      case "e":
        this.rotate = "Right";
        break;
      case "q":
        this.rotate = "Left";
        break;
      case "r":
        this.client.rotation = 0;
        break;
      case "c":
        this.tilemap.country.alpha = 0;
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
      case "e":
        this.rotate = "None";
        break;
      case "q":
        this.rotate = "None";
        break;
      case "c":
        this.tilemap.country.alpha = 1;
        break;
    }
  });

  this.input.on(
    "wheel",
    (pointer: Phaser.Input.Pointer) => {
      const prevZoom = camera.zoom;
      const zoomFactor = 1.12;

      if (pointer.deltaY < 0) {
        camera.zoom *= zoomFactor;
      } else if (pointer.deltaY > 0) {
        camera.zoom /= zoomFactor;
        camera.zoom = Math.max(this.minZoom, camera.zoom); // Cap the zoom at 2
      }

      // Calculate the zoom ratio and the difference in camera position
      const zoomRatio = camera.zoom / prevZoom;
      const dx = (pointer.worldX - camera.worldView.centerX) * (1 - zoomRatio);
      const dy = (pointer.worldY - camera.worldView.centerY) * (1 - zoomRatio);

      // Adjust the camera position to keep the pointer position fixed during zoom
      camera.scrollX -= dx;
      camera.scrollY -= dy;

      if (prevZoom > 2 && camera.zoom < 2) {
        for (const [_, landmass] of this.formations) {
          this.pixelScale = 2;
          landmass.redraw();
        }
        return;
      } else if (prevZoom < 2 && camera.zoom > 2) {
        for (const [_, landmass] of this.formations) {
          this.pixelScale = 1;
          landmass.redraw();
        }
        return;
      }
    },
    this
  );
  this.reactEvents?.emit("Client Update", this.client);
  this.cameras.main.fadeIn(250);
}
