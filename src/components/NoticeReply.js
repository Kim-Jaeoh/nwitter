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
      )}
    </>
  );
};
