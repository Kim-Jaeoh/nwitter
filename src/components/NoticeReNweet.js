import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../fbase";
import { useState } from "react";
import { useEffect } from "react";
import styled from "./NoticeReNweet.module.css";
import { useRef } from "react";
import { NoticeInnerContents } from "./NoticeInnerContents";

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

  const goPage = () => {
    console.log("");
  };

  return (
    <>
      {loading && (
        <NoticeInnerContents
          goPage={goPage}
          creatorInfo={creatorInfo}
          Obj={reNweetsObj}
          text={"글에 리트윗을 했습니다."}
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
        //         <span>@{reNweetsObj?.email?.split("@")[0]}</span>
        //         <span>님이</span>
        //         &nbsp;
        //         <span className={styled.reNweet__name}>
        //           "{reNweetsObj.text}"
        //         </span>
        //         &nbsp;
        //         <span> 글에 리트윗을 했습니다.</span>
        //       </p>
        //     </div>
        //     <div
        //       style={{ marginLeft: "auto" }}
        //       className={styled.reNweet__time}
        //     >
        //       <p>{timeToString(reNweetsObj.reNweetAt)}</p>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  );
};
