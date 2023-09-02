import Square from "../../../../Square/Square";
import Formation from "../../../Formation";

export default function clean(squares: Set<Square>, increaseState: () => void) {
  for (const square of squares) {
    if (square.hasShoreline) {
      square.isBorder = false;
      square.isCountryBorder = false;
      square.hasShoreline = false;
    }
  }
  increaseState();
}
