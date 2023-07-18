import styles from "./styles.module.scss";
import Slider from "../Slider/Slider";

import useStore from "../../store/store";
import { useState } from "react";

const Expand = () => {
  const { clientData } = useStore();
  return (
    <section className={styles.wrapper} style={{ right: "2rem" }}>
      <header className={styles.header}>
        <h2>Expand / Decrease</h2>
        <p>
          Expand a landmass by left clicking on it and turn islands into
          continents. Note: Expanding a large mass by even a little could still
          result in a massive change.
        </p>
      </header>
      <Slider
        eventName="Max Target Size"
        name="Expansion"
        value={clientData.maxTargetSize}
        min={0}
        max={100}
        steps={[
          "Barely anything",
          "Not a lot",
          "Just a little",
          "Some",
          "Moderate",
          "Abundant",
          "Plentiful",
        ]}
      />
    </section>
  );
};

export default Expand;
