import Formation from "../Formation";

export default function clear(this: Formation, massIndex: number) {
  const subtract = () => {
    if (this.landmasses[massIndex].size > 0) {
      for (const square of this.landmasses[massIndex]) {
        square.subtract(2);
      }

      requestAnimationFrame(subtract);
    } else {
      for (const square of this.landmasses[massIndex]) {
        square.remove();
      }
      this.landmasses.splice(massIndex, 1);
      cancelAnimationFrame(requestId);
      return;
    }
  };

  const requestId = requestAnimationFrame(subtract);
}
