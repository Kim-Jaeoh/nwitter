import { useRef } from "react";
import { useEffect } from "react";
import styled from "./Loading.module.css";

const BarLoader = ({ height, count }) => {
  const barRef = useRef();

  useEffect(() => {
    barRef.current.style.width = count + "%";
  }, [count]);

  return (
    <div className={styled.loader} style={{ marginBottom: height }}>
      <div
        ref={barRef}
        className={styled.loader__bar}
        // style={{
        //   width: `${count}%`,
        // }}
      />
    </div>
  );
};

export default BarLoader;
