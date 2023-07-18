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

const NewLandmass = () => {
  const { emitter, clientData } = useStore();
  const [tabIndex, setTabIndex] = useState<number>(-1);

  useEffect(() => {
    console.log(climateKeys);
    console.log(climateKeys.indexOf(clientData.climate));
  }, [clientData.climate]);

  return (
    <section className={styles.wrapper} style={{ right: "2rem" }}>
      <header className={styles.header}>
        <h2>Generate Landmass</h2>
        <p>
          Shape a new landmass by left clicking anywhere on the ocean. Though
          the shapes will be generated randomly, you can refine the outcomes to
          your liking by adjusting the settings below.
        </p>
      </header>

      <Slider
        eventName="Max Target Size"
        name="Target Size"
        value={clientData.maxTargetSize}
        min={0}
        max={350}
        steps={[
          "Tiny",
          "Very small",
          "Small",
          "Medium",
          "Large",
          "Very large",
          "Huge",
          "Massive",
          "Enormous",
        ]}
      />
      <Slider
        eventName="Climate Change"
        name="Climate"
        value={climateKeys.indexOf(clientData.climate)}
        min={0}
        max={climateKeys.length - 1}
        steps={climateKeys}
        precise
      />

      <Tab
        opensAt={0}
        amount={4}
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
        amount={4}
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
        amount={4}
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
        amount={4}
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
      </Tab>
    </section>
  );
};

export default NewLandmass;
