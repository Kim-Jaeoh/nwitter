import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useState } from "react";
import { useEffect } from "react";
import { NoticeInnerContents } from "./NoticeInnerContents";

export const NoticeReNweet = ({ reNweetsObj, userObj }) => {
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [nweets, setNweets] = useState([]);
  const [loading, setLoading] = useState(false);

  // 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", reNweetsObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [reNweetsObj, userObj.email]);

  // 트윗 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "nweets", reNweetsObj.parent), (doc) => {
      setNweets(doc.data());
    });
  }, [reNweetsObj]);

  return (
    <>
      {loading && (
        <NoticeInnerContents
          creatorInfo={creatorInfo}
          obj={reNweetsObj}
          nweets={nweets}
          text={
            reNweetsObj?.replyId
              ? "답글에 리트윗을 했습니다."
              : "글에 리트윗을 했습니다."
          }
        />
      )}
    </>
  );
};
