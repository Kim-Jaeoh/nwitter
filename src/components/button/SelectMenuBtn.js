import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "./SelectMenuBtn.module.css";

const SelectMenuBtn = ({ url, text, selected, num }) => {
  const [size, setSize] = useState(null);

  useEffect(() => {
    const check = url?.includes("profile");
    setSize(check);
  }, [url]);

  return (
    <Link
      to={url}
      className={`${styled.container} ${size && styled.sizeContainer}`}
    >
      <div
        className={`${styled.btnBox} ${selected === num && styled.selectedBox}`}
      >
        <p>{text}</p>
      </div>
    </Link>
  );
};

export default SelectMenuBtn;
