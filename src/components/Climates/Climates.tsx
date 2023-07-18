import styles from "./styles.module.scss";
import EventEmitter from "eventemitter3";

const Climates: React.FC = () => {
  return (
    <section className={styles.wrapper}>
      {climates.map(({ name, color, icon }) => (
        <button style={{ backgroundColor: color }}>
          <div className={styles.name}>{icon}</div>
        </button>
      ))}
    </section>
  );
};

export default Climates;

const climates = [
  { name: "Random", color: "grey", icon: "🎲" },
  {
    name: "Tropical Rainforest",
    description:
      "A hot and humid climate with abundant rainfall and lush vegetation.",
    color: "Green",
    icon: "🌴",
  },
  {
    name: "Desert",
    description: "An arid region with little rainfall and sparse vegetation.",
    color: "Yellow",
    icon: "🌵",
  },
  {
    name: "Temperate Forest",
    description:
      "A moderate climate with distinct seasons and diverse deciduous forests.",
    color: "Brown",
    icon: "🌳",
  },
  {
    name: "Grassland",
    description:
      "A vast expanse of grasses with a few scattered trees and seasonal variations.",
    color: "Light Green",
    icon: "🌾",
  },
  {
    name: "Mediterranean",
    description:
      "A mild climate with dry summers and rainy winters, often characterized by shrublands.",
    color: "Olive",
    icon: "🌿",
  },
  {
    name: "Tundra",
    description:
      "A cold and treeless region with permafrost and low-growing vegetation.",
    color: "White",
    icon: "❄️",
  },
  {
    name: "Taiga",
    description:
      "A subarctic climate with long, cold winters and coniferous forests.",
    color: "Dark Green",
    icon: "🌲",
  },
  {
    name: "Savanna",
    description:
      "A tropical grassland with scattered trees and a distinct wet and dry season.",
    color: "Gold",
    icon: "🦁",
  },
  {
    name: "Polar",
    description:
      "An extremely cold climate near the Earth's poles with icy conditions and minimal vegetation.",
    color: "Blue",
    icon: "🐧",
  },
];
