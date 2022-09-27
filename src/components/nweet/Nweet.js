import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../../fbase";
import React, { useEffect, useState } from "react";

import { NweetBox } from "./NweetBox";
import { useToggleReNweet } from "../../hooks/useToggleReNweet";
import { useTimeToString } from "../../hooks/useTimeToString";

const Nweet = ({ nweetObj, isOwner, userObj, reNweetsObj }) => {
  const [creatorInfo, setCreatorInfo] = useState({});

  const [loading, setLoading] = useState(false);

  //  map 처리 된 유저 정보들
  useEffect(() => {
    onSnapshot(doc(dbService, "users", nweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [nweetObj]);

  const { reNweet, setReNweet, toggleReNweet } = useToggleReNweet(
    reNweetsObj,
    nweetObj,
    userObj
  );

  const { timeToString } = useTimeToString();

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
          timeToString={timeToString}
        />
      )}
    </>
  );
};

export default Nweet;
