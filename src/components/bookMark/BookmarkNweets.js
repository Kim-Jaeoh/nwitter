import { collection, onSnapshot, query } from "firebase/firestore";
import { dbService } from "../../fbase";
import React, { useEffect, useState } from "react";
import Nweet from "../nweet/Nweet";
import styled from "../profile/NoInfo.module.css";

export const BookmarkNweets = ({ creatorInfo, reNweetsObj, userObj }) => {
  const [nweetBookmark, setNweetBookmark] = useState([]);
  const [loading, setLoading] = useState(false);

  // 트윗 정보 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "nweets"));
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filter = userArray.filter((id) =>
        creatorInfo.bookmark?.includes(id.id)
      );
      setNweetBookmark(filter);
      setLoading(true);
    });
  }, [creatorInfo.bookmark]);

  return (
    <>
      {loading && (
        <>
          {nweetBookmark.length !== 0 ? (
            <div>
              {nweetBookmark?.map((myBook) => (
                <Nweet
                  key={myBook.id}
                  nweetObj={myBook}
                  userObj={userObj}
                  reNweetsObj={reNweetsObj}
                />
              ))}
            </div>
          ) : (
            <div className={styled.noInfoBox}>
              <div className={styled.noInfo}>
                <h2>아직 저장한 트윗이 없습니다</h2>
                <p>지금 일어나는 일을 북마크에 담아보세요.</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
