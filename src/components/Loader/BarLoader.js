import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ProgressBar } from "react-loader-spinner";
import { useSelector } from "react-redux";
import styled from "./Loading.module.css";

const BarLoader = ({ progress }) => {
  const barRef = useRef();
  const [count, setCount] = useState(1);
  const currentProgressBar = useSelector((state) => state.user.load);

  useEffect(() => {
    if (currentProgressBar?.load) {
      const counter = () => {
        let startCount = 0;

        return () => {
          setCount((startCount += 1));

          if (count >= 100) {
            return;
          }
        };
      };

      const counterNumber = counter();
      setInterval(() => counterNumber(), 500 / 100); // 3초 안에 100을 올려야 함 (3000s / 100)
    }
    return () => clearInterval();
  }, [currentProgressBar?.load]);

  return (
    <div className={styled.loader}>
      <div
        ref={barRef}
        className={styled.loader__bar}
        style={{
          width: `${count}%`,
        }}
      />
    </div>
  );
};

export default BarLoader;
