import { useEffect, useState } from "react";
import { EventEmitter } from "eventemitter3";

const useEventEmitter = (): EventEmitter | null => {
  const [emitter, setEmitter] = useState<EventEmitter | null>(null);

  useEffect(() => {
    const emitterInstance = new EventEmitter();
    setEmitter(emitterInstance);

    return () => {
      emitterInstance.removeAllListeners();
    };
  }, []);

  return emitter;
};

export default useEventEmitter;
