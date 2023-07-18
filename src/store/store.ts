import { create } from "zustand";
import Store from "./types";

const useStore = create<Store>((set, get) => ({
  emitter: null,
  selection: { landmass: null, islandIndex: null },
  clientData: {
    tool: "Pointer",
    climate: "Temperate",
    maxTargetSize: 0,
    generate: {
      continents: 0,
      islands: 0,
      isles: 0,
    },
  },
  set,
}));

export default useStore;
