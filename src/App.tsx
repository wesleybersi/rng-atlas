import "./App.scss";
import Slider from "./components/Slider/Slider";
import Toolbar from "./components/Toolbar/Toolbar";

import Game from "./game/game";

import useEventEmitter from "./hooks/useEventEmitter";
import { useEffect, useState } from "react";
import useStore from "./store/store";
import NewLandmass from "./components/NewLandmass/NewLandmass";
import InfoPanel from "./components/InfoPanel/InfoPanel";

import { GiWorld as IconWorld } from "react-icons/gi";
import { FiMoon as IconMoon } from "react-icons/fi";
import { FiSun as IconSun } from "react-icons/fi";
import { AiOutlineFullscreenExit as IconFullscreenExit } from "react-icons/ai";
import { AiOutlineFullscreen as IconFullscreen } from "react-icons/ai";

import imageExample1 from "./assets/example1.png";
import imageExample2 from "./assets/example2.png";
import imageExample3 from "./assets/example3.png";

import { RxReset as IconReset } from "react-icons/rx";

import { BsEye as IconHide, BsEyeSlash as IconShow } from "react-icons/bs";

import { GiPerspectiveDiceSixFacesFive as IconShuffle } from "react-icons/gi";

import { RxBorderDotted as IconCountries } from "react-icons/rx";

import { ToolName } from "./store/types";
import Formation from "./game/entities/Formation/Formation";
import generateRandomCountryName from "./game/entities/Formation/helper/random-name";
import Compass from "./components/Compass/Compass";

import Randomize from "./components/Randomize/Randomize";
import Tooltip from "./components/Tooltip/Tooltip";
import { isObject } from "util";
import Country from "./game/entities/Country/Country";
import Legend from "./components/Legend/Legend";
import ZoomLevel from "./components/ZoomLevel/ZoomLevel";

function App() {
  const emitter = useEventEmitter();
  const {
    set,
    emitter: storeEmitter,
    selection,
    clientData,
    mapData,
  } = useStore();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isHudHidden, setIsHudHidden] = useState<boolean>(false);

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [mapSize, setMapSize] = useState<"Small" | "Medium" | "Large">("Small");

  const { tool } = clientData;
  const [forcePointer, setForcePointer] = useState<boolean>(false);
  const [worldName, setWorldName] = useState<string>(
    generateRandomCountryName()
  );

  const [hover, setHover] = useState<{
    x: number;
    y: number;
    landmass: string;
    country: string;
    tooltip: string;
  }>({ x: 0, y: 0, landmass: "", country: "", tooltip: "" });

  useEffect(() => {
    if (isFullScreen) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (!emitter) return;
    if (!storeEmitter) set({ emitter });
    function handleClientUpdate(data: any) {
      set({
        clientData: {
          tool: data.tool as ToolName,
          selectMode: data.selectMode,
          amount: data.amount,
          spread: data.spread,
          climate: data.climate,
          rotation: data.rotation,
          eraserRadius: data.eraserRadius,
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
      formation: Formation | null;
      country: Country | null;
      massIndex: number | null;
    }) {
      set({
        selection: {
          formation: selected.formation,
          massIndex: selected.massIndex,
          country: selected.country,
        },
      });
    }

    function handleHoverUpdate(data: any) {
      setHover({
        x: data.x,
        y: data.y,
        landmass: data.landmass ? data.landmass.name : "",
        country: data.country ? data.country.name : "",
        tooltip: "",
      });
    }

    function handleMapData(data: any) {
      set({
        mapData: {
          expanse: data.expanse,
          landmassCount: data.landmassCount,
          countryCount: data.countryCount,
          forming: data.forming,
        },
      });
    }

    emitter?.on("Client Update", handleClientUpdate);
    emitter?.on("Map Data", handleMapData);
    emitter?.on("New Selection", handleNewSelection);
    emitter?.on("Hover Update", handleHoverUpdate);
    return () => {
      emitter?.off("Client Update", handleClientUpdate);
      emitter?.off("Map Data", handleMapData);
      emitter?.off("New Selection", handleNewSelection);
      emitter?.off("Hover Update", handleHoverUpdate);
    };
  }, [emitter]);

  useEffect(() => {
    switch (clientData.tool) {
      case "Pointer":
        if (hover.landmass) setForcePointer(true);
        else setForcePointer(false);
        break;
      case "Generate":
        setForcePointer(true);
        break;
      case "Randomize":
        setForcePointer(false);
        break;
    }
  }, [hover.landmass, clientData.tool]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "]") {
        setIsDarkMode((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div
      className="App"
      style={{
        cursor: forcePointer ? "pointer" : "",
      }}
    >
      {!hasStarted ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `url(${imageExample3})`,
            backgroundSize: "cover",
            backgroundPosition: "-5% 85%",
          }}
        >
          <section className="start">
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <IconWorld size="24px" />
              <h2>TerraForge</h2>
            </div>
            <p>
              Create, discover, and explore procedurally generated landmasses.
              All in real-time at the click of a button.
            </p>

            <div className="start-name">
              <span className="b">World name:</span>
              <div>
                <input
                  type="text"
                  value={worldName}
                  onChange={(event) => setWorldName(event.target.value)}
                />{" "}
                <button
                  className="start-button"
                  onClick={() => setWorldName(generateRandomCountryName())}
                >
                  <IconShuffle size="32px" />
                </button>
              </div>
            </div>
            <div className="start-size">
              <span className="b">Map size:</span>
              <div className="start-size-grid">
                <button
                  style={{
                    outline:
                      mapSize === "Small" ? "2px solid var(--text-color)" : "",
                  }}
                  onClick={() => setMapSize("Small")}
                >
                  970x540
                </button>
                <button
                  style={{
                    outline:
                      mapSize === "Medium" ? "2px solid var(--text-color)" : "",
                  }}
                  onClick={() => setMapSize("Medium")}
                >
                  1920x1080
                </button>
                <button
                  style={{
                    outline:
                      mapSize === "Large" ? "2px solid var(--text-color)" : "",
                  }}
                  onClick={() => setMapSize("Large")}
                >
                  2780x1620
                </button>
              </div>
            </div>
            <div className="start-buttons">
              <button
                className="start-button"
                onClick={() => {
                  setHasStarted(true);
                  setTimeout(() => emitter?.emit("Start", mapSize), 25);
                }}
              >
                Start
              </button>
            </div>
          </section>
        </div>
      ) : (
        <>
          <div>
            <header style={{ opacity: isHudHidden ? 0 : 1 }}>
              <section className="header-name">
                <h2>TerraForge</h2>
              </section>
              <section>
                <div
                  className="menu-item"
                  onClick={() => {
                    const clientIsSure = confirm(
                      "This will remove everything. Are you sure?"
                    );
                    if (clientIsSure) {
                      emitter?.emit("Tool Change", "Pointer");
                      emitter?.emit("Clear All");
                      setHasStarted(false);
                    }
                  }}
                >
                  <IconReset size="24px" />
                  <p>Reset</p>
                </div>
              </section>
              <section>
                {isDarkMode ? (
                  <div onClick={() => setIsDarkMode(false)}>
                    <IconMoon size="24px" />
                  </div>
                ) : (
                  <div onClick={() => setIsDarkMode(true)}>
                    <IconSun size="24px" />
                  </div>
                )}

                {isHudHidden ? (
                  <div onClick={() => setIsHudHidden(false)}>
                    <IconShow size="24px" />
                  </div>
                ) : (
                  <div onClick={() => setIsHudHidden(true)}>
                    <IconHide size="24px" />
                  </div>
                )}
                {isFullScreen ? (
                  <div onClick={() => setIsFullScreen(false)}>
                    <IconFullscreenExit size="24px" />
                  </div>
                ) : (
                  <div onClick={() => setIsFullScreen(true)}>
                    <IconFullscreen size="24px" />
                  </div>
                )}
              </section>
            </header>
          </div>
          {!isHudHidden && (
            <>
              {tool === "Pointer" && <InfoPanel />}
              {tool === "Generate" && <NewLandmass />}
              {tool === "Randomize" && <Randomize />}

              <Toolbar setHover={setHover} />
              <div className="world-info">
                {/* <input
              type="text"
              value={worldName}
              onChange={(event) => setWorldName(event.target.value)}
            /> */}
                <div
                  className="world-info-panel"
                  style={{
                    display: "flex",
                    gap: "2rem",
                  }}
                >
                  <p>{worldName}</p>
                  <div>
                    {mapData.expanse} <sup>km&sup2;</sup>
                  </div>
                  <div>
                    {mapData.landmassCount}
                    {mapData.forming ? <>+</> : ""}{" "}
                    {mapData.landmassCount === 1 ? "island" : "islands"}
                  </div>
                  <div>
                    {/* <IconCountries size="24px" /> */}
                    {mapData.countryCount}{" "}
                    {mapData.countryCount === 1 ? "country" : "countries"}
                  </div>
                </div>
              </div>
              <ZoomLevel />
              <Compass />
              <Legend />
              {/* <section className="x-y">
                <div className="section">
                  <div className="combiner">
                    <p>
                      <span>x:</span> {hover.x}
                    </p>
                    <p>
                      <span>y:</span> {hover.y}
                    </p>
                  </div>
                </div>
              </section> */}
            </>
          )}
        </>
      )}

      {
        <div
          style={{
            fontFamily: "font1",
            position: "absolute",
            left: "-1000px",
            visibility: "hidden",
            opacity: 0,
          }}
        >
          .
        </div>
      }
      <Game emitter={emitter} />
      {((clientData.selectMode === "Landmass" && hover.landmass) ||
        (clientData.selectMode === "Country" && hover.country) ||
        hover.tooltip) && (
        <Tooltip
          string={
            hover.tooltip !== ""
              ? hover.tooltip
              : clientData.selectMode === "Landmass"
              ? hover.landmass
              : hover.country
          }
        />
      )}
    </div>
  );
}

export default App;
