import React from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import styled from "./SelectNoInfo.module.css";
import CircleLoader from "../loader/CircleLoader";
import Nweet from "../nweet/Nweet";
import useGetFbInfo from "../../hooks/useGetFbInfo";

export const Replies = ({ userObj, creatorInfo }) => {
  const [filterReplies, setFilterReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { reNweets } = useGetFbInfo();

  // 답글 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "replies"),
      where("email", "==", creatorInfo.email)
    );
    const unsubscribe = onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortArr = userArray.sort((a, b) => b.createdAt - a.createdAt);
      setFilterReplies(sortArr);
      setLoading(true);
    });

    return () => {
      unsubscribe();
    };
  }, [creatorInfo.email]);

  return (
    <>
      {loading ? (
        <>
          {filterReplies.length ? (
            <div>
              {filterReplies.map((myNweet) => (
                <Nweet
                  isOwner={myNweet.creatorId === userObj.uid}
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
      ) : (
        <CircleLoader />
      )}
    </>
  );
};
