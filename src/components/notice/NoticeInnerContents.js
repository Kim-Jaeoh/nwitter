import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGoPage } from "../../hooks/useGoPage";
import { useTimeToString } from "../../hooks/useTimeToString";
import styled from "./NoticeInnerContents.module.css";

export const NoticeInnerContents = ({ obj, creatorInfo, text, nweets }) => {
  const imgRef = useRef();
  const nameRef = useRef();
  const location = useLocation();
  const [followTime, setFollowTime] = useState([]);

  // 팔로우 시간 정보 가져오기
  useEffect(() => {
    if (creatorInfo?.followingAt) {
      creatorInfo?.followingAt.map((time) => setFollowTime(time));
    }
  }, [creatorInfo?.followingAt]);

  const { timeToString } = useTimeToString();

  const { goNotice } = useGoPage(obj, "", imgRef, nameRef, "");

  return (
    <>
      <div className={styled.nweet} onClick={(e) => goNotice(e)}>
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

              {location.pathname.includes("renweets") && (
                <span className={styled.reNweet__name}>
                  "{obj.text ? obj.text : nweets?.text}"
                </span>
              )}
              {location.pathname.includes("replies") && (
                <span className={styled.reNweet__name}>"{nweets?.text}"</span>
              )}
              {location.pathname.includes("followers") && null}

              <span> {text}</span>
            </p>
          </div>
          <div style={{ marginLeft: "auto" }} className={styled.reNweet__time}>
            {location.pathname.includes("renweets") && (
              <p>{timeToString(obj?.reNweetAt)}</p>
            )}
            {location.pathname.includes("replies") && (
              <p>{timeToString(obj?.createdAt)}</p>
            )}
            {location.pathname.includes("followers") && (
              <p>{timeToString(followTime)}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};