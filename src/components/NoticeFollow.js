import React from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "../fbase";
import { useState } from "react";
import { useEffect } from "react";
import { NoticeInnerContents } from "./NoticeInnerContents";

export const NoticeFollow = ({ followObj, userObj }) => {
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  // 팔로워 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", followObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [followObj]);

  return (
    <>
      {loading && (
        <NoticeInnerContents
          creatorInfo={creatorInfo}
          obj={followObj}
          text={"회원님을 팔로우 했습니다."}
        />
      )}
    </>
  );
};
