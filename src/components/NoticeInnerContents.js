import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "./NoticeReNweet.module.css";

export const NoticeInnerContents = ({ obj, creatorInfo, text, nweets }) => {
  const imgRef = useRef();
  const nameRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const [followTime, setFollowTime] = useState([]);

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

  const goPage = (e) => {
    if (
      !imgRef.current?.contains(e.target) &&
      !nameRef.current?.contains(e.target)
    ) {
      history.push("/nweet/" + obj.id);
    } else {
      history.push("/user/mynweets/" + obj.email);
    }
  };

  const goPages = (e) => {
    if (
      imgRef.current.contains(e.target) ||
      nameRef.current.contains(e.target)
    ) {
      history.push("/user/mynweets/" + obj.email);
    } else if (
      !imgRef.current.contains(e.target) &&
      !nameRef.current.contains(e.target)
    ) {
      history.push("/nweet/" + obj.parent);
    }
  };

  // 팔로우 시간 정보 가져오기
  useEffect(() => {
    if (creatorInfo.followAt) {
      creatorInfo.followAt.map((time) => setFollowTime(time));
    }
  }, [creatorInfo.followAt]);
  return (
    <>
      {/* {location.pathname.includes("renweets") && ( */}
      <div className={styled.nweet} onClick={goPages}>
        <div className={styled.nweet__container}>
          <div className={styled.nweet__profile} ref={imgRef}>
            <img
              src={creatorInfo?.photoURL || obj?.photoURL}
              alt="profileImg"
              className={styled.profile__image}
            />
          </div>
          <div className={styled.reNweetBox}>
            <p>
              <span ref={nameRef}>
                @{(obj?.email || creatorInfo.email)?.split("@")[0]}
              </span>
              <span>님이 </span>

              {location.pathname.includes("renweet") && (
                <span className={styled.reNweet__name}>
                  "{obj.text ? obj.text : nweets.text}"
                </span>
              )}
              {location.pathname.includes("reply") && (
                <span className={styled.reNweet__name}>"{nweets.text}"</span>
              )}

              {location.pathname.includes("follow") && null}

              <span> {text}</span>
            </p>
          </div>
          <div style={{ marginLeft: "auto" }} className={styled.reNweet__time}>
            {location.pathname.includes("follow") ? (
              <p>{timeToString(followTime)}</p>
            ) : (
              <p>{timeToString(obj?.createdAt || obj?.reNweetAt)}</p>
            )}
          </div>
        </div>
      </div>
      {/* // )} */}
    </>
  );
};
