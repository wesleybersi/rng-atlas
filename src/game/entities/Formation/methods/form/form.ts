import { oneIn, random } from "../../../../utils/helper-functions";
import Country from "../../../Country/Country";
import climates from "../../../GeoMap/land/climates";
import Ice from "../../../Ice/Ice";
import Square from "../../../Square/Square";
import Formation from "../../Formation";
import clean from "./states/clean";
import Clean from "./states/clean";

export default function form(
  this: Formation,
  massIndex = 0,
  targetExpanse: number,
  fullExpand?: boolean
) {
  let inQueue = true;
  const states = [
    "Clean",
    "Expand",
    "Coastal Islands",
    "Solidify",
    "Define Borders",
    "Carve Rivers",
    "Smoothen",
    "Form Ice",
    "Ocean Grading",
    "Add Cities",
    "Seperate Mass",
    "Form Countries",
    "Expand Countries",
    "Merge Small Countries",
    "Finish",
  ];
  let state = 0;

  const increaseState = () => {
    state++;
  };

  const creation = this.squares.size === 0;

  const initialSet = new Set<Square>();
  for (const square of this.landmasses[massIndex]) {
    initialSet.add(square);
  }
  const expandedSet = new Set();
  const islands: Set<Square> = new Set();
  let islandExpansion = 1;
  let riverStart = false;
  let resetCount = 0;
  let solidification = Math.max(random(4), 2);

  type Side = "top" | "left" | "right" | "bottom";
  const sides: Side[] = ["top", "left", "right", "bottom"];
  let ignoreSide: "top" | "right" | "left" | "bottom" | undefined = !oneIn(4)
    ? sides[random(sides.length)]
    : undefined;

  const decreaseExpanse = () => {
    targetExpanse--;
  };

  const next = () => {
    if (this.forceAbort) {
      return cancelAnimationFrame(requestId);
    }
    const { formingLandmasses, maxFormingLandmasses } = this.scene;
    const { islandSettings } = this;
    if (
      (inQueue &&
        formingLandmasses.size < maxFormingLandmasses &&
        !formingLandmasses.has(this)) ||
      this.priority
    ) {
      formingLandmasses.add(this);
      inQueue = false;
    }

    if (inQueue) return requestAnimationFrame(next);

    if (creation && this.squares.size === 0) {
      new Square(
        this.scene,
        this.origin.y,
        this.origin.x,
        this.origin.elevation,
        this.climate,
        this,
        0,
        random(random(climates.get(this.climate.name)?.colors.length ?? 0))
      ).expand(true);
    }
    //Each iteration, a new set.
    const squares = new Set([...this.landmasses[massIndex]]);

    switch (states[state]) {
      case "Clean":
        clean(squares, () => state++);
        break;
      case "Expand": {
        if (oneIn(35)) {
          ignoreSide = !oneIn(4) ? sides[random(sides.length)] : undefined;
        }

        if (targetExpanse > 0 && !this.forceFinish) {
          const startCount = expandedSet.size;

          for (const square of squares) {
            if (expandedSet.has(square)) continue;

            if (!creation && oneIn(35)) {
              const climate = climates.get(this.scene.client.climate);
              if (climate) {
                square.climate = climate;
                square.climateSet = 0;
              }
            }

            expandedSet.add(square);
            square.expand(fullExpand, ignoreSide, decreaseExpanse);

            if (oneIn(islandSettings.probability)) {
              square.spawnIsland(decreaseExpanse);
            }

            //TODO
            if (oneIn(5)) square.merge(10, square.color, 1);
            if (!initialSet.has(square) && oneIn(this.wetness))
              square.subtract(oneIn(5) ? 2 : undefined, undefined);
          }

          const endCount = expandedSet.size;

          if (startCount >= endCount) {
            resetCount++;
            if (resetCount > 25) {
              state++;
              break;
            }
            //If everyone expanded but target hasn't been reached
            //Reset border squares
            for (const square of squares) {
              if (oneIn(50)) {
                console.count("Reset square");
                square.expanded = false;
                expandedSet.delete(square);
              }
            }
            break;
          }
        } else {
          state++;
        }
        break;
      }
      case "Coastal Islands":
        if (islands.size === 0) {
          for (const square of squares) {
            if (islands.has(square)) continue;
            if (oneIn(this.islandSettings.probability)) {
              const island = square.spawnIsland();
              if (island) {
                islands.add(island);
              }
            }
          }
        } else {
          if (islandExpansion > 0) {
            for (const square of islands) {
              square.expand();
            }
            islandExpansion--;
          } else {
            state++;
          }
        }
        break;
      case "Solidify":
        if (solidification > 0) {
          for (const square of squares) {
            if (initialSet.has(square)) continue;
            square.expand(solidification % 2 === 0);
          }
          solidification--;
        } else {
          state++;
        }
        break;
      case "Define Borders":
        for (const square of squares) {
          square.isBorder = square.surroundingSquares().size !== 4;
        }
        state++;
        break;
      case "Carve Rivers":
        {
          if (this.squares.size < 200) {
            state++;
          }
          if (!riverStart) {
            riverStart = true;
            for (const square of Array.from(squares)) {
              if (oneIn(2)) continue;
              if (square.isBorder && oneIn(this.riverProbability)) {
                square.formRiver(initialSet);
              }
            }
          } else if (this.carvingRivers.size === 0) state++;
        }
        break;
      case "Smoothen":
        for (const square of squares) {
          if (square.surroundingSquares().size < 2) {
            square.remove();
          }
        }
        state++;
        break;
      case "Form Ice":
        if (
          this.climate.name !== "Polar" &&
          this.climate.name !== "Subarctic"
        ) {
          state++;
          break;
        }
        for (const square of squares) {
          if (initialSet.has(square)) continue;
          if (!square.isBorder) continue;
          for (const [_, { x, y }] of square.emptySurroundings()) {
            if (oneIn(2)) continue;
            new Ice(this.scene, y, x, 0, this.climate.name);
          }
        }
        state++;
        break;
      case "Ocean Grading":
        if (
          this.climate.name === "Polar" ||
          this.climate.name === "Subarctic"
        ) {
          state++;
          break;
        }
        this.addShore(massIndex);

        state++;
        break;
      case "Add Cities":
        state++;
        break;

      case "Seperate Mass":
        if (this.newArrivals.size > 0) {
          for (const square of this.newArrivals) {
            this.squares.set(`${square.y},${square.x}`, square);
            square.landmass = this;
          }
          this.newArrivals.clear();
        }
        this.seperateMass();
        state++;
        break;

      case "Form Countries":
        {
          for (const square of squares) {
            if (oneIn(500)) square.conquer(true);
          }

          for (const island of this.landmasses) {
            for (const square of island) {
              square.conquer(true);
              if (island.size > 200) break;
            }
            for (const square of island) {
              square.conquer(true);
              if (island.size > 200) break;
            }
          }

          state++;
        }
        break;
      case "Expand Countries":
        {
          for (const square of squares) {
            if (square.country) {
              square.conquer();
            }
          }
          for (const square of squares) {
            square.conquer(true);
          }
          for (const square of squares) {
            const enemyNeighbors = Array.from(
              square.surroundingSquares()
            ).filter(([_, neighbor]) => neighbor.country !== square.country);

            if (enemyNeighbors.length >= 3) {
              for (const [_, neighbor] of enemyNeighbors) {
                if (!square.country || !neighbor.country) continue;
                square.country.squares.delete(`${square.x},${square.y}`);
                if (square.country?.squares.size === 0) {
                  this.scene.countries.delete(square.country);
                }
                square.country = neighbor.country;
                square.country.squares.set(`${square.x},${square.y}`, square);
                this.scene.tilemap.placeCountryTile(
                  square.x,
                  square.y,
                  square.country.color,
                  0.45
                );
                break;
              }
            }

            if (
              square.isBorder ||
              square.surroundingSquares().size !== 4 ||
              enemyNeighbors.length > 0
            ) {
              square.isCountryBorder = true;
            } else {
              square.isCountryBorder = false;
            }
          }
          state++;
        }
        break;
      case "Merge Small Countries":
        {
          //Some small island countries should just be part of the closest big country.
          const islandsToMerge = new Set<Set<Square>>();
          for (const island of this.landmasses) {
            if (island.size < 150) {
              if (island.size > 75 && oneIn(10)) continue; //Cyprus
              for (const square of island) {
                if (island.size === square.country?.squares.size) {
                  islandsToMerge.add(island);
                  break;
                }
              }
            }
          }

          console.log("Islands to merge:", islandsToMerge);

          const spread = 24;
          for (const island of islandsToMerge) {
            let foundCountry: Country | null = null;
            for (const square of island) {
              if (foundCountry) break;
              if (!square.isBorder) continue;
              for (let i = 1; i < spread; i++) {
                if (!foundCountry) {
                  const foundLand = [
                    this.scene.occupiedLand.get(`${square.x},${square.y - i}`),
                    this.scene.occupiedLand.get(`${square.x},${square.y + i}`),
                    this.scene.occupiedLand.get(`${square.x - i},${square.y}`),
                    this.scene.occupiedLand.get(`${square.x + i},${square.y}`),
                  ];
                  for (const land of foundLand) {
                    if (!land) continue;
                    if (!land.country || land.country === square.country)
                      continue;
                    foundCountry = land.country;
                    break;
                  }
                }
              }
            }
            if (foundCountry) {
              console.log("Found a country!");
              for (const square of island) {
                square.country?.squares.delete(`${square.x},${square.y}`);
                if (square.country?.squares.size === 0) {
                  this.scene.countries.delete(square.country);
                }
                square.country = foundCountry;
                square.country.squares.set(`${square.x},${square.y}`, square);
                square.scene.tilemap.placeCountryTile(
                  square.x,
                  square.y,
                  square.country.color,
                  0.45
                );
              }
            }
          }
        }
        state++;
        break;
      case "Finish":
        setTimeout(() => {
          this.forceFinish = false;
          this.hasFormed = true;
          console.log(
            `%c${this.name} has succesfully been ${
              creation ? "formed" : "expanded"
            } with an expanse of ${this.squares.size}`,
            "background-color: #00cc44; color: white"
          );
        });
        formingLandmasses.delete(this);
        this.scene.events.emit("Landmass Has Formed", this);
        // this.targetExpanse = this.squares.size;
        return cancelAnimationFrame(requestId);
    }
    requestAnimationFrame(next);
  };

  this.hasRivers = false;
  this.hasFormed = false;

  const requestId = requestAnimationFrame(next);
}
