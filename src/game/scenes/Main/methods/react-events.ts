import { ToolName } from "../../../../store/types";
import {
  ClimateName,
  climateKeys,
} from "../../../entities/GeoMap/land/climates";
import MainScene from "../MainScene";

function reactEventListener(this: MainScene) {
  this.reactEvents?.on("Max Target Size", (size: number) => {
    this.client.maxTargetSize = size;
    this.reactEvents?.emit("Client Update", this.client);
  });

  this.reactEvents?.on("Tool Change", (tool: ToolName) => {
    if (tool !== "Pointer") {
      this.client.selectMode = "Landmass";
      this.tilemap.country.alpha = 0;
    }
    this.client.tool = tool;
    this.reactEvents?.emit("Client Update", this.client);
  });

  this.reactEvents?.on("Amount", (amount: number) => {
    this.client.amount = amount;
    this.reactEvents?.emit("Client Update", this.client);
  });
  this.reactEvents?.on("Spread", (spread: number) => {
    this.client.spread = spread;
    this.reactEvents?.emit("Client Update", this.client);
  });

  this.reactEvents?.on("Select Mode", (mode: "Country" | "Landmass") => {
    this.client.selectMode = mode;
    if (mode === "Country") {
      this.tilemap.country.alpha = 1;
    } else {
      this.tilemap.country.alpha = 0;
    }
    this.reactEvents?.emit("Client Update", this.client);
  });

  this.reactEvents?.on("Climate Change", (climateIndex: number) => {
    const climate: ClimateName = climateKeys[climateIndex];
    console.log(climateIndex);
    console.log(climate);
    this.client.climate = climate;
    this.reactEvents?.emit("Client Update", this.client);
  });

  //Generate params
  this.reactEvents?.on("Params-Isles", (isles: number) => {
    this.client.generate.isles.amount = isles;
    this.reactEvents?.emit("Client Update", this.client);
  });
  this.reactEvents?.on("Params-Islands", (islands: number) => {
    this.client.generate.islands.amount = islands;
    this.reactEvents?.emit("Client Update", this.client);
  });
  this.reactEvents?.on("Params-Continents", (continents: number) => {
    this.client.generate.continents.amount = continents;
    this.reactEvents?.emit("Client Update", this.client);
  });

  this.reactEvents?.on("Randomize", () => this.generateWorldmap(false));

  this.reactEvents?.on("Clear All", () => {
    for (const landmass of this.formingLandmasses) {
      landmass.forceAbort = true;
      landmass.squares.clear();
    }
    this.occupiedLand.clear();
    this.formations.clear();
    this.countries.clear();
    this.tilemap.clear();
    this.isActive = false;
    this.hasStarted = false;
  });

  this.reactEvents?.on("Zoom Level", (type: "In" | "Out") => {
    switch (type) {
      case "In":
        if (this.cameras.main.zoom >= 10) break;
        this.tweens.add({
          targets: this.cameras.main,
          zoom: Math.ceil(this.cameras.main.zoom + 1),
          duration: 250,
          ease: "Sine.easeInOut",
        });
        break;
      case "Out": {
        if (this.cameras.main.zoom <= 1) break;
        this.tweens.add({
          targets: this.cameras.main,
          zoom: Math.floor(this.cameras.main.zoom - 1),
          duration: 250,
          ease: "Sine.easeInOut",
        });
      }
    }
  });

  this.reactEvents?.on("Start", (mapSize: "Small" | "Medium" | "Large") => {
    switch (mapSize) {
      case "Small":
        this.mapWidth = 960;
        this.mapHeight = 540;
        this.minZoom = 2;
        break;
      case "Medium":
        this.mapWidth = 1920;
        this.mapHeight = 1080;
        this.minZoom = 1;
        break;
      case "Large":
        this.mapWidth = 2780;
        this.mapHeight = 1620;
        this.minZoom = 1;
        break;
    }
    this.isActive = true;
  });
}

export default reactEventListener;
