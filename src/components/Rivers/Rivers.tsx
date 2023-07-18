import styles from "./styles.module.scss";
import Slider from "../Slider/Slider";

import useStore from "../../store/store";
import { useState } from "react";

const Rivers = () => {
  const { clientData } = useStore();
  return (
    <section className={styles.wrapper} style={{ right: "2rem" }}>
      <header className={styles.header}>
        <h2>Add Rivers</h2>
        <p>
          Click on a landmass to place the start of a river. Where will it lead?
          No one knows. Rivers tends to be a bit stubborn. Some just want to be
          lakes.
        </p>
      </header>
      <Slider
        eventName="Max River Length"
        name="Max River Length"
        value={clientData.maxTargetSize}
        min={0}
        max={100}
        steps={[
          "Very Small",
          "Small",
          "Medium",
          "Large",
          "Very Large",
          "Endless",
        ]}
      />
    </section>
  );
};

export default Rivers;
