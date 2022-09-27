import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbService } from "../../fbase";

import { useTimeToString } from "../../hooks/useTimeToString";
import { NweetBox } from "../nweet/NweetBox";
import { useToggleRepliesRenweet } from "../../hooks/useToggleRepliesRenweet";

const DetailNweetReply = ({ nweetObj, userObj, nweets, reNweetsObj }) => {
  // nweets = 원글 계정 정보
  // nweetObj = 답글 계정 정보

  const [creatorInfo, setCreatorInfo] = useState({});
  const [loading, setLoading] = useState(false);

  //  map 처리 된 유저 정보들
  useEffect(() => {
    onSnapshot(doc(dbService, "users", nweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [nweetObj]);

  const { reNweet, setReNweet, toggleReNweet } = useToggleRepliesRenweet(
    reNweetsObj,
    nweetObj,
    userObj
  );

  const { timeToString2 } = useTimeToString();

  return (
    <>
      {loading && (
        <>
          <NweetBox
            loading={loading}
            userObj={userObj}
            nweetObj={nweetObj}
            creatorInfo={creatorInfo}
            reNweetsObj={reNweetsObj}
            reNweet={reNweet}
            setReNweet={setReNweet}
            toggleReNweet={toggleReNweet}
            isOwner={userObj.email === nweetObj.email}
            timeToString={timeToString2}
          />
        </>
      )}
    </>
  );
};

export default DetailNweetReply;
