import { create } from "zustand";
import Store from "./types";

const useStore = create<Store>((set, get) => ({
  emitter: null,
  selection: { formation: null, country: null, massIndex: null },
  mapData: {
    forming: 0,
    expanse: 0,
    landmassCount: 0,
    countryCount: 0,
  },
  clientData: {
    tool: "Pointer",
    selectMode: "Landmass",
    amount: 0,
    spread: 0,
    rotation: 0,
    climate: "Temperate",
    eraserRadius: 0.5,
    maxTargetSize: 50,
    generate: {
      continents: 0,
      islands: 0,
      isles: 0,
    },
  },
  set,
}));

export default useStore;
