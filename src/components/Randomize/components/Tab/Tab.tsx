import { IconType } from "react-icons";
import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";

interface Props {
  opensAt: number;
  index: number;
  amount: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  Icon: IconType;
  children: JSX.Element;
}

const Tab: React.FC<Props> = ({
  opensAt,
  amount,
  index,
  setIndex,
  children,
  Icon,
}) => {
  const isOpen = opensAt === index;
  const lensRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!lensRef.current) return;
    setHeight(lensRef.current.offsetHeight + 40);
  }, [lensRef]);
  return (
    <section
      className={styles.wrapper}
      style={{ height, zIndex: !isOpen ? 2 : 1 }}
    >
      <div
        className={styles.lens}
        ref={lensRef}
        style={{
          zIndex: isOpen ? 500 : 1,
          borderBottomLeftRadius: opensAt === 0 && isOpen ? "0" : undefined,
          borderBottomRightRadius: opensAt === 4 && isOpen ? "0" : undefined,
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        {children}

        <div
          className={styles.tab}
          style={{
            zIndex: 1000,
            left: `${(opensAt * 100) / amount}%`,
          }}
          onClick={() => (isOpen ? setIndex(-1) : setIndex(opensAt))}
        >
          {<Icon size="100%" />}
        </div>
      </div>
    </section>
  );
};

export default Tab;
