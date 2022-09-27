import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import UpdateNweetModal from "../modal/UpdateNweetModal";
import { NweetBox } from "./NweetBox";
import { useToggleRepliesRenweet } from "../../hooks/useToggleRepliesRenweet";
import { useTimeToString } from "../../hooks/useTimeToString";

const NweetsSum = ({ nweetObj, userObj, reNweetsObj }) => {
  // nweets = 원글 계정 정보
  // nweetObj = 답글 계정 정보

  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [creatorInfo, setCreatorInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  //  map 처리 된 유저 정보들
  useEffect(() => {
    onSnapshot(doc(dbService, "users", nweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [nweetObj]);

  // 리트윗
  const { reNweet, setReNweet, toggleReNweet } = useToggleRepliesRenweet(
    reNweetsObj,
    nweetObj,
    userObj
  );

  const { timeToString } = useTimeToString();

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
            timeToString={timeToString}
          />

          {/* {userObj.email === nweetObj.email && isEditing && (
            <UpdateNweetModal
              userObj={userObj}
              creatorInfo={creatorInfo}
              reNweetsObj={reNweetsObj}
              nweetObj={nweetObj}
              newNweet={newNweet}
              setNewNweet={setNewNweet}
              setIsEditing={setIsEditing}
              nweetAttachment={nweetObj.attachmentUrl}
              isEditing={isEditing}
            />
          )} */}
        </>
      )}
    </>
  );
};

export default NweetsSum;
