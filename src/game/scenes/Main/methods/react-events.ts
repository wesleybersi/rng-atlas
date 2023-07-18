import { ToolName } from "../../../../store/types";
import {
  ClimateName,
  climateKeys,
  climates,
} from "../../../entities/GeoMap/land/climates";
import MainScene from "../MainScene";

function reactEventListener(this: MainScene) {
  this.reactEvents?.on("Max Target Size", (size: number) => {
    this.client.maxTargetSize = size;
    this.reactEvents?.emit("Client Update", this.client);
  });

  this.reactEvents?.on("Tool Change", (tool: ToolName) => {
    this.client.tool = tool;
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

  this.reactEvents?.on("Start Generating", () => {
    this.isActive = true;
  });
}

export default reactEventListener;
