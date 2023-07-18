import "./App.scss";
import Slider from "./components/Slider/Slider";
import Toolbar from "./components/Toolbar/Toolbar";

import Game from "./game/game";

import useEventEmitter from "./hooks/useEventEmitter";
import { useEffect, useState } from "react";
import useStore from "./store/store";
import NewLandmass from "./components/NewLandmass/NewLandmass";
import InfoPanel from "./components/InfoPanel/InfoPanel";

import { ToolName } from "./store/types";
import Landmass from "./game/entities/Landmass/Landmass";
import Expand from "./components/Expand/Expand";
import Rivers from "./components/Rivers/Rivers";

function App() {
  const emitter = useEventEmitter();
  const { set, emitter: storeEmitter, selection, clientData } = useStore();
  const [showGenerator, setShowGenerator] = useState<boolean>(true);
  const { tool } = clientData;
  const [forcePointer, setForcePointer] = useState<boolean>(false);

  const [hover, setHover] = useState<{
    x: number;
    y: number;
    landmass: string;
  }>({ x: -1, y: -1, landmass: "" });

  useEffect(() => {
    if (!emitter) return;
    if (!storeEmitter) set({ emitter });
    function handleClientUpdate(data: any) {
      console.log(data.climate);
      set({
        clientData: {
          tool: data.tool as ToolName,
          climate: data.climate,
          maxTargetSize: data.maxTargetSize,
          generate: {
            continents: data.generate.continents.amount,
            islands: data.generate.islands.amount,
            isles: data.generate.isles.amount,
          },
        },
      });
    }

    function handleNewSelection(selected: {
      landmass: Landmass | null;
      islandIndex: number | null;
    }) {
      set({
        selection: {
          landmass: selected.landmass,
          islandIndex: selected.islandIndex,
        },
      });
    }

    function handleHoverUpdate(data: any) {
      setHover({
        x: data.x,
        y: data.y,
        landmass: data.landmass ? data.landmass.name : "",
      });
    }
    emitter?.on("Client Update", handleClientUpdate);
    emitter?.on("New Selection", handleNewSelection);
    emitter?.on("Hover Update", handleHoverUpdate);
  }, [emitter]);

  useEffect(() => {
    switch (clientData.tool) {
      case "Expand":
      case "Pointer":
        if (hover.landmass) setForcePointer(true);
        else setForcePointer(false);
        break;
      case "Generate":
        if (!hover.landmass) setForcePointer(true);
        else setForcePointer(false);
        break;
    }
  }, [hover.landmass, clientData.tool]);

  return (
    <div className="App" style={{ cursor: forcePointer ? "pointer" : "" }}>
      <section className="xy" style={{ left: "2rem", width: "20rem" }}>
        <p>
          <span className="b">x: </span>
          {hover.x}
        </p>
        <p>
          <span className="b">y: </span>
          {hover.y}
        </p>
        <p>{hover.landmass}</p>
      </section>
      {showGenerator && (
        <section className="start">
          <h2>TerraGen</h2>
          <p>Every landmass spawns its own islands too</p>
          <Slider
            eventName="Params-Continents"
            name="Continents"
            value={clientData.generate.continents}
            min={0}
            max={100}
            steps={[
              "None",
              "Very few",
              "Few",
              "Some",
              "Moderate",
              "Many",
              "A lot",
              "A whole lot",
              "Abundant",
            ]}
          />
          <Slider
            eventName="Params-Islands"
            name="Islands"
            value={clientData.generate.islands}
            min={0}
            max={100}
            steps={[
              "None",
              "Very few",
              "Few",
              "Some",
              "Moderate",
              "Many",
              "A lot",
              "A whole lot",
              "Abundant",
            ]}
          />

          <Slider
            eventName="Params-Isles"
            name="Isles"
            value={clientData.generate.isles}
            min={0}
            max={100}
            steps={[
              "None",
              "Very few",
              "Few",
              "Some",
              "Moderate",
              "Many",
              "A lot",
              "A whole lot",
              "Abundant",
            ]}
          />

          <div className="start-buttons">
            <button
              className="leave-empty"
              onClick={() => {
                setShowGenerator(false);
              }}
            >
              Leave Empty
            </button>
            <button
              className="start-button"
              onClick={() => {
                emitter?.emit("Start Generating");
                setShowGenerator(false);
              }}
            >
              Generate
            </button>
          </div>
        </section>
      )}
      {tool === "Pointer" && selection.landmass && <InfoPanel />}
      {tool === "Generate" && <NewLandmass />}
      {tool === "Expand" && <Expand />}
      {tool === "River Tool" && <Rivers />}

      <Toolbar />
      <Game emitter={emitter} />
    </div>
  );
}

export default App;
