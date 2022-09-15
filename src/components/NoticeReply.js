import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../fbase";
import { useState } from "react";
import { useEffect } from "react";
import styled from "./NoticeReNweet.module.css";
import { useRef } from "react";
import { NoticeInnerContents } from "./NoticeInnerContents";

export const NoticeReply = ({ replyObj, userObj }) => {
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  // 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", replyObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [replyObj]);

  const goPage = () => {
    console.log("");
  };

  return (
    <>
      {loading && (
        <NoticeInnerContents
          goPage={goPage}
          creatorInfo={creatorInfo}
          Obj={replyObj}
          text={"답글에 리트윗을 했습니다"}
        />
        // <div className={styled.nweet}>
        //   <div className={styled.nweet__container} onClick={goPage}>
        //     <div className={styled.nweet__profile} ref={imgRef}>
        //       <img
        //         src={loading && creatorInfo?.photoURL}
        //         alt="profileImg"
        //         className={styled.profile__image}
        //       />
        //     </div>
        //     <div className={styled.reNweetBox}>
        //       <p>
        //         <span>@{replyObj?.email?.split("@")[0]}</span>
        //         <span>님이</span>
        //         &nbsp;
        //         <span className={styled.reNweet__name}>"{replyObj.text}"</span>
        //         &nbsp;
        //         <span> 답글에 리트윗을 했습니다.</span>
        //       </p>
        //     </div>
        //     <div
        //       style={{ marginLeft: "auto" }}
        //       className={styled.reNweet__time}
        //     >
        //       <p>{timeToString(replyObj.createdAt)}</p>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  );
};
