import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useState } from "react";
import { useEffect } from "react";
import { NoticeInnerContents } from "./NoticeInnerContents";
import useGetFbInfo from "../../hooks/useGetFbInfo";

export const NoticeFollow = ({ followObj }) => {
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const { myInfo } = useGetFbInfo(); // 내 정보 가져오기

  // 팔로워 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", followObj.email),
      (doc) => {
        setCreatorInfo(doc.data());
        setLoading(true);
      }
    );

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [followObj]);

  return (
    <>
      {loading && (
        <NoticeInnerContents
          creatorInfo={creatorInfo}
          userInfo={myInfo}
          noticeUser={followObj}
          text={"회원님을 팔로우 했습니다."}
        />
      )}
    </>
  );
};
