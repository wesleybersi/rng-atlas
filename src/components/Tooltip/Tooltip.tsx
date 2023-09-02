import useMousePosition from "../../hooks/useMousePosition";
import styles from "./tooltip.module.scss";

const Tooltip = ({ string }: { string: string }) => {
  const { x, y } = useMousePosition();

  return (
    <div
      className={styles.tooltip}
      style={{
        position: "fixed",
        left: x + 18,
        top: y + 4,
        opacity: x === 0 && y === 0 ? 0 : 1,
      }}
    >
      {string}
    </div>
  );
};

export default Tooltip;
