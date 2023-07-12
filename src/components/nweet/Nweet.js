import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../../fbase";
import React, { useEffect, useState } from "react";
import { NweetBox } from "./NweetBox";
import { useTimeToString } from "../../hooks/useTimeToString";
import { useToggleRepliesRenweet } from "../../hooks/useToggleRepliesRenweet";

const Nweet = ({ isOwner, nweetObj, userObj, reNweetsObj }) => {
  const [creatorInfo, setCreatorInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const { reNweet, setReNweet, toggleReNweet } = useToggleRepliesRenweet(
    reNweetsObj,
    nweetObj,
    userObj
  );

  //  map 처리 된 유저 정보들
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", nweetObj.email),
      (doc) => {
        setCreatorInfo(doc.data());
        setLoading(true);
      }
    );
    return () => unsubscribe();
  }, [nweetObj]);

  return (
    <>
      {loading && (
        <NweetBox
          loading={loading}
          userObj={userObj}
          nweetObj={nweetObj}
          creatorInfo={creatorInfo}
          reNweetsObj={reNweetsObj}
          reNweet={reNweet}
          setReNweet={setReNweet}
          toggleReNweet={toggleReNweet}
          isOwner={isOwner}
        />
      )}
    </>
  );
};

export default Nweet;
