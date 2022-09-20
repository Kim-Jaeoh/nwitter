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

  return (
    <>
      {loading && (
        <NoticeInnerContents
          creatorInfo={creatorInfo}
          obj={replyObj}
          text={"글에 답글을 달았습니다"}
        />
      )}
    </>
  );
};
