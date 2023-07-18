class Island {
  scene: MainScene;
  name: string;
  origin: { x: number; y: number; elevation: number };
  squares: Map<string, Square>;
  targetExpanse: number;
  terrainDifference = Math.max(random(20), 5);
  islandSettings = {
    probability: Math.max(random(500), 200),
    spread: Math.max(random(80), 25),
    additionalExpansion: random(15),
  };
  mountainProbability = Math.max(random(200), 50);
  riverProbability = Math.max(random(100), 25);
  wetness = Math.max(random(250), 10);
  climate: Climate;
  hasShoreLine = false;
  hasRivers = false;
  hasFormed = false;
  carvingRivers = new Set<Square>();
  priority = false;
  islands: Set<Island>[] = [new Set()];
  constructor(
    scene: MainScene,
    name: string,
    origin: { x: number; y: number; elevation: number },
    squares: Map<string, Square>,
    expanse: number,
    climate: Climate
  ) {
    this.scene = scene;
    this.name = name;
    this.origin = origin;
    this.squares = squares;
    this.targetExpanse = expanse;
    this.climate = climate;
    scene.landmasses.set(this.name, this);

    //First square
  }
  removeMass() {
    const subtract = () => {
      if (this.squares.size > 0) {
        for (const [_, square] of Array.from(this.squares)) {
          square.defineBorders();
          if (square.isBorder && !Math.floor(Math.random() * 4))
            square.remove();
        }

        requestAnimationFrame(subtract);
      } else {
        this.scene.landmasses.delete(this.name);
        return cancelAnimationFrame(requestId);
      }
    };
  }
}
