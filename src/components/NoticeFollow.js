import React from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../fbase";
import { useState } from "react";
import { useEffect } from "react";
import { NoticeInnerContents } from "./NoticeInnerContents";

export const NoticeFollow = ({ followObj, userObj }) => {
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  // 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", followObj), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [followObj]);

  const goPage = () => {
    console.log("");
  };

  return (
    <>
      {loading && (
        <NoticeInnerContents
          goPage={goPage}
          creatorInfo={creatorInfo}
          Obj={followObj}
          text={"팔로우 했습니다."}
        />
      )}
    </>
  );
};
