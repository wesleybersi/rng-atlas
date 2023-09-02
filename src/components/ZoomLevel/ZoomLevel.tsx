import useStore from "../../store/store";
import styles from "./styles.module.scss";

const ZoomLevel = () => {
  const { emitter } = useStore();
  return (
    <div className={styles.wrapper}>
      <button onClick={() => emitter?.emit("Zoom Level", "Out")} />
      <button onClick={() => emitter?.emit("Zoom Level", "In")} />
    </div>
  );
};

export default ZoomLevel;
