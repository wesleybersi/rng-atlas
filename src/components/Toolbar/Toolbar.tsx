import styles from "./styles.module.scss";

import { FaMousePointer as IconPointer } from "react-icons/fa";
import { GiIceland as IconGenerate } from "react-icons/gi";
import { BiExpand as IconExpand } from "react-icons/bi";
import { BiServer as IconDiminish } from "react-icons/bi";
import { BiTrash as IconRemove } from "react-icons/bi";
import { GiRiver as IconRiver } from "react-icons/gi";
import { MdLensBlur as IconBlur } from "react-icons/md";

import useStore from "../../store/store";
import { ToolName } from "../../store/types";
import { IconType } from "react-icons";
import { useEffect } from "react";

const Toolbar = () => {
  const { emitter, clientData } = useStore();
  const { tool } = clientData;

  useEffect(() => {
    if (!emitter) return;
    function keydown(event: KeyboardEvent) {
      switch (event.key) {
        case "1":
          emitter?.emit("Tool Change", tools[0].name);
          break;
        case "2":
          emitter?.emit("Tool Change", tools[1].name);
          break;
        case "3":
          emitter?.emit("Tool Change", tools[2].name);
          break;
        case "4":
          emitter?.emit("Tool Change", tools[3].name);
          break;
      }
    }
    window.addEventListener("keydown", keydown);
  }, [emitter]);
  return (
    <section className={styles.toolbar}>
      {tools.map(({ name, icon: Icon }, index) => (
        <button
          onClick={() => emitter?.emit("Tool Change", name)}
          style={{ outline: tool === name ? "4px solid lightblue" : "" }}
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
  icon: IconType;
}

const tools: Tool[] = [
  {
    name: "Pointer",
    icon: IconPointer,
  },
  {
    name: "Generate",
    icon: IconGenerate,
  },
  {
    name: "Expand",
    icon: IconExpand,
  },
  {
    name: "Blur",
    icon: IconBlur,
  },
  {
    name: "River Tool",
    icon: IconRiver,
  },
];
