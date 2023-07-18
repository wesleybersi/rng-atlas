import EventEmitter from "eventemitter3";
import Landmass from "../game/entities/Landmass/Landmass";
import { ClimateName } from "../game/entities/GeoMap/land/climates";

interface Store {
  emitter: EventEmitter<string | symbol, any> | null;
  selection: { landmass: Landmass | null; islandIndex: number | null };
  clientData: ClientData;
  set: (
    partial:
      | Store
      | Partial<Store>
      | ((state: Store) => Store | Partial<Store>),
    replace?: boolean | undefined
  ) => void;
}

export default Store;

export type ToolName =
  | "Pointer"
  | "Generate"
  | "Expand"
  | "Diminish"
  | "Remove"
  | "River Tool"
  | "Blur";

export interface ClientData {
  maxTargetSize: number;
  tool: ToolName;
  climate: ClimateName;
  generate: {
    continents: number;
    islands: number;
    isles: number;
  };
}
