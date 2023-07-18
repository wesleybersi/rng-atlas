import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import useStore from "../../store/store";

interface Props {
  name: string;
  eventName: string | symbol;
  value: number;
  min: number;
  max: number;
  steps: string[];
  precise?: boolean;
}

const Slider: React.FC<Props> = ({
  name,
  eventName,
  value,
  min,
  max,
  steps = ["Cold", "Med", "Hot"],
  precise,
}): JSX.Element => {
  const { emitter } = useStore();
  const [step, setStep] = useState<string>(steps[0]);

  useEffect(() => {
    let stepIndex = 0;
    if (!precise) {
      if (value === 0) {
        stepIndex = 0;
      } else if (value === max) {
        stepIndex = steps.length - 1;
      } else {
        stepIndex = Math.floor((value / max) * (steps.length - 3) + 1);
      }
    } else {
      stepIndex = Math.floor((value / max) * (steps.length - 1));
    }
    console.log(stepIndex);
    setStep(steps[stepIndex]);
  }, [value]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.slider}>
        <div
          className={styles.header}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <label>{name}</label>
          <p>{step}</p>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            console.log("A");
            emitter?.emit(eventName, Number(event.target.value));
          }}
          id="myRange"
        />
      </div>
    </div>
  );
};

export default Slider;
