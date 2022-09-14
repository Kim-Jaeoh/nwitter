import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../fbase";
import { useState } from "react";
import { useEffect } from "react";
import styled from "./NoticeReNweet.module.css";
import { useRef } from "react";

export const NoticeReNweet = ({ reNweetsObj, userObj }) => {
  const imgRef = useRef();
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  // 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", reNweetsObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [reNweetsObj, userObj.email]);

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

  const goPage = () => {
    console.log("");
  };

  return (
    <>
      {loading && (
        <div className={styled.nweet}>
          <div className={styled.nweet__container} onClick={goPage}>
            <div className={styled.nweet__profile} ref={imgRef}>
              <img
                src={loading && creatorInfo?.photoURL}
                alt="profileImg"
                className={styled.profile__image}
              />
            </div>
            <div className={styled.reNweetBox}>
              <p>
                <span>@{reNweetsObj?.email?.split("@")[0]}</span>
                <span>님이</span>
                &nbsp;
                <span className={styled.reNweet__name}>
                  "{reNweetsObj.text}"
                </span>
                &nbsp;
                <span> 글에 리트윗을 했습니다.</span>
              </p>
            </div>
            <div
              style={{ marginLeft: "auto" }}
              className={styled.reNweet__time}
            >
              <p>{timeToString(reNweetsObj.reNweetAt)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
