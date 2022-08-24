import { Link } from "react-router-dom";
import styled from "./SelectMenuBtn.module.css";

const SelectMenuBtn = ({ url, text, selected, num }) => {
  return (
    <Link to={url} className={styled.container}>
      <div
        className={`${styled.btnBox} ${selected === num && styled.selectedBox}`}
      >
        <p>{text}</p>
      </div>
    </Link>
  );
};

export default SelectMenuBtn;
