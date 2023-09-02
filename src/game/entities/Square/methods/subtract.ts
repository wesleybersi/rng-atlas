import { oneIn } from "../../../utils/helper-functions";
import Square from "../Square";

export default function subtract(
  this: Square,
  chance?: number,
  secondary?: number,
  increase?: () => void
) {
  const carve = () => {
    for (const [_, square] of this.surroundingSquares()) {
      if (oneIn(chance ?? 2)) {
        if (increase) increase();
        square.subtract(secondary ?? 3, secondary);
        square.remove();
      }
    }
  };
  requestAnimationFrame(carve);
}
