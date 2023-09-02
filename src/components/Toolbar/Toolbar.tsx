import styles from "./styles.module.scss";
import "../../styles/animations.scss";

import { BsHandIndex as IconPointer } from "react-icons/bs";
import { GiFloatingPlatforms as IconGenerate } from "react-icons/gi";
import { GiPerspectiveDiceSixFacesRandom as IconRandom } from "react-icons/gi";

import useStore from "../../store/store";
import { ToolName } from "../../store/types";
import { IconType } from "react-icons";
import { useEffect } from "react";

interface Props {
  setHover: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      landmass: string;
      country: string;
      tooltip: string;
    }>
  >;
}

const Toolbar: React.FC<Props> = ({ setHover }) => {
  const { emitter, clientData, mapData } = useStore();
  const { tool } = clientData;

  useEffect(() => {
    if (!emitter) return;
    function keydown(event: KeyboardEvent) {
      const numbers = "1234567890";
      let valid = false;
      for (const number of numbers) {
        if (event.key === number) {
          valid = true;
          break;
        }
      }
      if (valid) {
        emitter?.emit("Tool Change", tools[Number(event.key) - 1].name);
      }
    }
    window.addEventListener("keydown", keydown);
  }, [emitter]);
  return (
    <section className={styles.toolbar}>
      {tools.map(({ name, icon: Icon, tooltip }, index) => (
        <button
          onMouseEnter={() => setHover((prev) => ({ ...prev, tooltip }))}
          onMouseLeave={() => setHover((prev) => ({ ...prev, tooltip: "" }))}
          onClick={() => emitter?.emit("Tool Change", name)}
          style={{
            outline: tool === name ? "2px solid white" : "",
            animation:
              name === "Generate" &&
              mapData.expanse === 0 &&
              tool !== "Generate"
                ? "glow 500ms linear alternate infinite"
                : "",
          }}
        >
          <Icon size="50%" />
          <span>{index + 1}</span>
        </button>
      ))}
    </section>
  );
};

export default Toolbar;

interface Tool {
  name: ToolName;
  tooltip: string;
  icon: IconType;
}

const tools: Tool[] = [
  {
    name: "Pointer",
    tooltip: "Pointer",
    icon: IconPointer,
  },
  {
    name: "Generate",
    tooltip: "Generate / Expand landmass",
    icon: IconGenerate,
  },
  { name: "Randomize", tooltip: "Randomize", icon: IconRandom },
  // {
  //   name: "Move",
  //   icon: IconMove,
  // },
  // {
  //   name: "Brush",
  //   icon: IconBrush,
  // },
  // {
  //   name: "Elevate",
  //   icon: IconMountain,
  // },
  // {
  //   name: "Erase",
  //   icon: IconErase,
  // },
  // {
  //   name: "WaterLevel",
  //   icon: IconErase,
  // },
  // {
  //   name: "Settlements",
  //   icon: IconVillage,
  // },
  // {
  //   name: "River Tool",
  //   icon: IconRiver,
  // },
];
