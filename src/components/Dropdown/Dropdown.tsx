import EventEmitter from "eventemitter3";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { ClientData } from "../../App";

interface Props {
  emitter: EventEmitter<string | symbol, any> | null;
  name: string;
  eventName: string | symbol;
  options: string[];
}

const Dropdown: React.FC<Props> = ({
  emitter,
  name,
  eventName,
  options,
}): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <label>{name}</label>
      <input
        list="browsers"
        name="browser"
        id="browser"
        onChange={(event) => emitter?.emit(eventName, event.target.value)}
      />
      <datalist id="browsers">
        {options.map((option) => (
          <option>{option}</option>
        ))}
      </datalist>
    </div>
  );
};

export default Dropdown;
