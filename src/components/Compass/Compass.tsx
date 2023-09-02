import useStore from "../../store/store";
import styles from "./styles.module.scss";

const Compass = () => {
  const { clientData } = useStore();
  const { rotation } = clientData;
  return (
    <section className={styles.wrapper}>
      <div className={styles.rose} style={{ rotate: `${-rotation}deg` }}>
        <span className={styles.north}></span>
        <span className={styles.east}></span>
        <span className={styles.south}></span>
        <span className={styles.west}></span>
      </div>
    </section>
  );
};

export default Compass;
