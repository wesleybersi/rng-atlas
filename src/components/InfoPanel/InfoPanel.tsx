import { useState } from "react";
import generateRandomCountryName from "../../game/entities/Landmass/helper/random-name";
import { oneIn, random } from "../../game/utils/helper-functions";
import useStore from "../../store/store";
import styles from "./styles.module.scss";

const InfoPanel = () => {
  const { selection } = useStore();
  const [countryName] = useState<string>(generateRandomCountryName());
  const [capitalName] = useState<string>(generateRandomCountryName());
  const [populationSize] = useState<number>(
    calculatePopulationSize(
      selection.landmass?.islands[selection.islandIndex ?? 0].size,
      selection.landmass?.climate ?? ""
    )
  );
  if (!selection.landmass || selection.islandIndex === null) return <></>;
  return (
    <section className={styles.wrapper}>
      <div className={styles.name}>
        <h2>{countryName}</h2>
      </div>
      <div>
        <span className="b">Capital:</span> {capitalName}
      </div>

      <div>
        <span className="b">Part of landmass:</span> {selection.landmass.name}
      </div>
      <div>
        <span className="b">Climate:</span> {selection.landmass.climate}
      </div>
      <div>
        <span className="b">Size: </span>
        {selection.landmass.islands[selection.islandIndex].size} km
        <sup>&sup2;</sup>
      </div>
      <div>
        <span className="b">Population: </span>
        {populationSize}
      </div>
      <div>
        <p>
          A land of profound beauty and historical significance, {countryName}{" "}
          epitomizes the harmonious coexistence of tradition and progress.
        </p>
      </div>
    </section>
  );
};

export default InfoPanel;

function calculatePopulationSize(size: number | undefined, climate: string) {
  if (size === undefined) return 0;
  // Define the population density range in persons per square kilometer
  const minDensity = 1; // Minimum density
  const maxDensity = 100; // Maximum density

  // Generate a random population density within the range
  const density =
    Math.floor(Math.random() * (maxDensity - minDensity + 1)) + minDensity;

  // Calculate the population size based on landmass size and density
  let population = Math.round(size * density);

  if (climate === "Polar") {
    population /= 10;
  }
  if (oneIn(10)) population = 0;
  if (oneIn(3)) population /= random(10);
  if (oneIn(6)) population *= random(3);
  return Math.floor(population);
}
