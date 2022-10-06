import React from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import styled from "./NoInfo.module.css";
import NweetsSum from "../nweet/NweetsSum";

export const Replies = ({ userObj, creatorInfo }) => {
  const [filterReplies, setFilterReplies] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [loading, setLoading] = useState(false);

  // 리트윗 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "reNweets")
      // where("parentEmail", "==", userObj.email)
      // orderBy("reNweetAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReNweets(reNweetArray);
      // setLoading(true);
    });
  }, []);

  // 답글 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "replies"),
      where("email", "==", creatorInfo.email)
    );
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // const filter = userArray.filter((id) => id.email === userObj.email);
      setFilterReplies(userArray);
      setLoading(true);
    });
  }, [creatorInfo.email]);

  return (
    <>
      {loading && (
        <>
          {filterReplies.length !== 0 ? (
            <div>
              {filterReplies.map((myNweet) => (
                <NweetsSum
                  key={myNweet.id}
                  nweetObj={myNweet}
                  userObj={userObj}
                  reNweetsObj={reNweets}
                />
              ))}
            </div>
          ) : (
            <div className={styled.noInfoBox}>
              <div className={styled.noInfo}>
                <h2>아직 답글이 없습니다</h2>
                <p>좋은 트윗과 소통하고 싶다면 답글을 달아보세요.</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
