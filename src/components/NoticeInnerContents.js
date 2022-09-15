import React, { useRef } from "react";
import styled from "./NoticeReNweet.module.css";

export const NoticeInnerContents = ({ goPage, obj, creatorInfo, text }) => {
  const imgRef = useRef();

  // 시간 표기
  const timeToString = (timestamp) => {
    const today = new Date();
    const timeValue = new Date(timestamp);

    const betweenTime = Math.floor(
      (today.getTime() - timeValue.getTime()) / 1000 / 60
    );
    if (betweenTime < 1) return "방금 전";
    if (betweenTime < 60) {
      return `${betweenTime}분 전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간 전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일 전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년 전`;
  };

  return (
    <div className={styled.nweet}>
      <div className={styled.nweet__container} onClick={goPage}>
        <div className={styled.nweet__profile} ref={imgRef}>
          <img
            src={creatorInfo?.photoURL}
            alt="profileImg"
            className={styled.profile__image}
          />
        </div>
        <div className={styled.reNweetBox}>
          <p>
            <span>@{obj?.email?.split("@")[0]}</span>
            <span>님이</span>
            &nbsp;
            {obj?.text && (
              <span className={styled.reNweet__name}>"{obj.text}"</span>
            )}
            &nbsp;
            <span> {text}</span>
          </p>
        </div>
        <div style={{ marginLeft: "auto" }} className={styled.reNweet__time}>
          <p>{timeToString(obj.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};
