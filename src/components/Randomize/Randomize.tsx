import styles from "./styles.module.scss";
import Slider from "../Slider/Slider";

import useStore from "../../store/store";
import { useEffect, useState } from "react";

import { MdLandscape as IconMountain } from "react-icons/md";
import { MdOutlineWater as IconRivers } from "react-icons/md";
import { GiHutsVillage as IconVillage } from "react-icons/gi";
import { GiIsland as IconIslands } from "react-icons/gi";

import Tab from "./components/Tab/Tab";
import { climateKeys } from "../../game/entities/GeoMap/land/climates";

const Randomize = () => {
  const { emitter, clientData } = useStore();
  const [tabIndex, setTabIndex] = useState<number>(-1);

  if (!clientData.climate) return <></>;
  return (
    <section className={styles.wrapper}>
      <section className={styles.header}>
        <h2>Randomize</h2>
        <p>
          Populate the full size of the map in real-time with randomly placed
          procedurally generated landmasses and islands.
        </p>
      </section>

      <Slider
        eventName="Params-Continents"
        name="Continents"
        value={clientData.generate.continents}
        min={1}
        max={7500}
        steps={["Not a lot", "A little", "A decent amount"]}
        precise
      />
      <Slider
        eventName="Params-Islands"
        name="Islands"
        value={clientData.generate.islands}
        min={1}
        max={7500}
        steps={[
          "Tiny",
          "Very small",
          "Small",
          "Medium",
          "Large",
          "Very large",
          "Huge",
          "Massive",
        ]}
        precise
      />
      <Slider
        eventName="Params-Isles"
        name="Isles"
        value={clientData.generate.isles}
        min={1}
        max={7500}
        steps={[
          "Tiny",
          "Very small",
          "Small",
          "Medium",
          "Large",
          "Very large",
          "Huge",
          "Massive",
        ]}
        precise
      />
      <button onClick={() => emitter?.emit("Randomize")}>Generate</button>

      {/* <Tab
        opensAt={0}
        amount={5}
        index={tabIndex}
        setIndex={setTabIndex}
        Icon={IconMountain}
      >
        <section className={styles.tabContent}>
          <h3>Elevation</h3>
          <Slider
            eventName="Initial Elevation"
            name="Initial Elevation"
            value={clientData.maxTargetSize}
            min={0}
            max={100}
            steps={[
              "Lowlands",
              "Hills",
              "Low Mountains",
              "High Mountains",
              "Peaks",
            ]}
          />
          <Slider
            eventName="Elevation"
            name="Elevation"
            value={clientData.maxTargetSize}
            min={0}
            max={100}
            steps={[
              "No Mountains",
              "Few Mountains",
              "Moderate Mountains",
              "Many Mountains",
              "Mountainous",
            ]}
          />
          <Slider
            eventName="Max Height"
            name="Max Height"
            value={clientData.maxTargetSize}
            min={0}
            max={100}
            steps={[
              "Lowlands",
              "Hills",
              "Low Mountains",
              "High Mountains",
              "Peaks",
            ]}
          />
        </section>
      </Tab>
      <Tab
        opensAt={2}
        amount={5}
        index={tabIndex}
        setIndex={setTabIndex}
        Icon={IconIslands}
      >
        <section className={styles.tabContent}>
          <h3>Islands</h3>
          <div className={styles.combiner}>
            <Slider
              eventName="Amount of islands"
              name="Amount of islands"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={[
                "No islands",
                "Few islands",
                "Moderate islands",
                "Many islands",
                "Lots of islands",
              ]}
            />
            <Slider
              eventName="Island sprawl"
              name="Island sprawl"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={[
                "Very thinly spread",
                "Thinly spread",
                "Normal spread",
                "Large spread",
                "Very large spread",
              ]}
            />
            <Slider
              eventName="Island sizes"
              name="Island sprawl"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={["Very small", "Small", "Medium", "Large", "Very large"]}
            />
          </div>
        </section>
      </Tab>
      <Tab
        opensAt={1}
        amount={5}
        index={tabIndex}
        setIndex={setTabIndex}
        Icon={IconRivers}
      >
        <section className={styles.tabContent}>
          <h3>Water Bodies</h3>
          <div className={styles.combiner}>
            <Slider
              eventName="Amount of rivers"
              name="Amount of rivers"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={[
                "No rivers",
                "Few rivers",
                "Moderate rivers",
                "Many rivers",
                "Lots of rivers",
              ]}
            />
            <Slider
              eventName="Max river length"
              name="Max river length"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={["Very short", "Short", "Medium", "Long", "Very long"]}
            />
          </div>
          <div className={styles.combiner}>
            <Slider
              eventName="Amount of lakes"
              name="Amount of lakes"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={[
                "No lakes",
                "Few lakes",
                "Moderate lakes",
                "Many lakes",
                "Lots of lakes",
              ]}
            />
            <Slider
              eventName="Max lake size"
              name="Max river length"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={["Very small", "Small", "Medium", "Large", "Very large"]}
            />
          </div>
        </section>
      </Tab>
      <Tab
        opensAt={3}
        amount={5}
        index={tabIndex}
        setIndex={setTabIndex}
        Icon={IconVillage}
      >
        <section className={styles.tabContent}>
          <h3>Settlements</h3>
          <div className={styles.combiner}>
            <Slider
              eventName="Amount of rivers"
              name="Amount of rivers"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={[
                "No rivers",
                "Few rivers",
                "Moderate rivers",
                "Many rivers",
                "Lots of rivers",
              ]}
            />
            <Slider
              eventName="Max river length"
              name="Max river length"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={["Very short", "Short", "Medium", "Long", "Very long"]}
            />
          </div>
          <div className={styles.combiner}>
            <Slider
              eventName="Amount of lakes"
              name="Amount of lakes"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={[
                "No lakes",
                "Few lakes",
                "Moderate lakes",
                "Many lakes",
                "Lots of lakes",
              ]}
            />
            <Slider
              eventName="Max lake size"
              name="Max river length"
              value={clientData.maxTargetSize}
              min={0}
              max={100}
              steps={["Very small", "Small", "Medium", "Large", "Very large"]}
            />
          </div>
        </section>
      </Tab> */}
    </section>
  );
};

export default Randomize;
