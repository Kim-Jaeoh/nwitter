import React, { useEffect, useState } from "react";
import { BsArrowUp } from "react-icons/bs";
import { RiArrowUpSLine } from "react-icons/ri";
import styled from "./TopButton.module.css";
import { throttle } from "lodash";

const TopButton = () => {
  const [scrollY, setScrollY] = useState(0);
  const [topBtnStatus, setTopBtnStatus] = useState(false); // 버튼 상태

  const handleFollow = throttle(() => {
    if (window.scrollY > 1400) {
      setTopBtnStatus(true);
    } else {
      setTopBtnStatus(false);
    }
    setScrollY(window.scrollY);
  }, 200);

  // 위로 가기
  useEffect(() => {
    window.addEventListener("scroll", handleFollow);

    return () => {
      window.removeEventListener("scroll", handleFollow);
    };
  }, []);

  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setScrollY(0); // scrollY 의 값을 초기화
    if (scrollY === 0) {
      setTopBtnStatus(false);
    }
  };

  return (
    <div
      onClick={handleTop} // 버튼 클릭시 함수 호출
      className={`${styled.container} ${
        topBtnStatus ? styled.container__show : styled.container__hide
      }`}
    >
      <button className={styled.btn}>
        <RiArrowUpSLine />
        {/* <BsArrowUp /> */}
      </button>
    </div>
  );
};

export default TopButton;
