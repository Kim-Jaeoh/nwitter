import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useState } from "react";
import { useEffect } from "react";
import { NoticeInnerContents } from "./NoticeInnerContents";

export const NoticeReply = ({ replyObj }) => {
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [nweets, setNweets] = useState([]);

  // 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", replyObj.email),
      (doc) => {
        setCreatorInfo(doc.data());
      }
    );

    return () => unsubscribe();
  }, [replyObj]);

  // 트윗 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "nweets", replyObj.parent),
      (doc) => {
        setNweets(doc.data());
      }
    );
    return () => unsubscribe();
  }, [replyObj]);

  return (
    <>
      {creatorInfo && nweets && (
        <NoticeInnerContents
          creatorInfo={creatorInfo}
          noticeUser={replyObj}
          nweets={nweets}
          text={"글에 답글을 달았습니다."}
        />
      )}
    </>
  );
};
