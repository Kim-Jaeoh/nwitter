import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTimeToString } from "../../hooks/useTimeToString";
import styled from "./NoticeInnerContents.module.css";

export const NoticeInnerContents = ({
  noticeUser,
  creatorInfo,
  text,
  nweets,
}) => {
  const imgRef = useRef();
  const nameRef = useRef();
  const location = useLocation();
  const [followTime, setFollowTime] = useState([]);

  // 팔로우 시간 정보 가져오기
  useEffect(() => {
    if (creatorInfo?.following) {
      creatorInfo?.following.map((follow) => setFollowTime(follow.followAt));
    }
  }, [creatorInfo?.following]);

  const { timeToString } = useTimeToString();

  return (
    <>
      <div className={styled.nweet}>
        <div className={styled.nweet__container}>
          <Link
            to={`/profile/mynweets/${noticeUser?.email}`}
            className={styled.nweet__profile}
            ref={imgRef}
          >
            <img
              src={creatorInfo?.photoURL || noticeUser?.photoURL}
              alt="profileImg"
              className={styled.profile__image}
            />
          </Link>
          <Link
            className={styled.nweet__contents}
            to={
              location.pathname.includes("followers")
                ? `/profile/mynweets/${noticeUser?.email}`
                : `/nweet/${noticeUser?.parent}`
            }
          >
            <div className={styled.reNweetBox}>
              <p>
                <span ref={nameRef}>
                  @{(noticeUser?.email || creatorInfo.email)?.split("@")[0]}
                </span>
                님이{" "}
                {location.pathname.includes("renweets") && (
                  <span className={styled.reNweet__name}>
                    "{noticeUser?.text ? noticeUser?.text : nweets?.text}"
                  </span>
                )}
                {location.pathname.includes("replies") && (
                  <span className={styled.reNweet__name}>"{nweets?.text}"</span>
                )}
                {location.pathname.includes("followers") && null}
                {text}
              </p>
            </div>
            <div
              style={{ marginLeft: "auto" }}
              className={styled.reNweet__time}
            >
              {location.pathname.includes("renweets") && (
                <p>{timeToString(noticeUser?.reNweetAt)}</p>
              )}
              {location.pathname.includes("replies") && (
                <p>{timeToString(noticeUser?.createdAt)}</p>
              )}
              {location.pathname.includes("followers") && (
                <p>{timeToString(followTime)}</p>
              )}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
