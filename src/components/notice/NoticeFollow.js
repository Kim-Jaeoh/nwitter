import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useState } from "react";
import { useEffect } from "react";
import { NoticeInnerContents } from "./NoticeInnerContents";

export const NoticeFollow = ({ followObj, userObj, userInfo }) => {
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [userInfos, setUserInfos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 팔로워 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", followObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [followObj]);

  // // 본인 정보 가져오기
  // useEffect(() => {
  //   onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
  //     setUserInfo(doc.data());
  //     setLoading(true);
  //   });
  // }, [userObj]);

  return (
    <>
      {loading && (
        <NoticeInnerContents
          creatorInfo={creatorInfo}
          userInfo={userInfo}
          obj={followObj}
          text={"회원님을 팔로우 했습니다."}
        />
      )}
    </>
  );
};
