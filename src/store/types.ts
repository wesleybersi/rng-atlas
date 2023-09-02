import EventEmitter from "eventemitter3";
import Formation from "../game/entities/Formation/Formation";
import { Climate, ClimateName } from "../game/entities/GeoMap/land/climates";
import Country from "../game/entities/Country/Country";

interface Store {
  emitter: EventEmitter<string | symbol, any> | null;
  selection: {
    formation: Formation | null;
    country: Country | null;
    massIndex: number | null;
  };
  clientData: ClientData;
  mapData: {
    forming: number;
    landmassCount: number;
    expanse: number;
    countryCount: number;
  };
  set: (
    partial:
      | Store
      | Partial<Store>
      | ((state: Store) => Store | Partial<Store>),
    replace?: boolean | undefined
  ) => void;
}

export default Store;

export type ToolName = "Pointer" | "Generate" | "Randomize";

export interface ClientData {
  maxTargetSize: number;
  selectMode: "Country" | "Landmass";
  tool: ToolName;
  amount: number;
  spread: number;
  rotation: number;
  eraserRadius: number;
  climate: ClimateName;
  generate: {
    continents: number;
    islands: number;
    isles: number;
  };
}
