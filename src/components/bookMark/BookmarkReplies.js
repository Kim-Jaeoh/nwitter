import { collection, onSnapshot, query } from "firebase/firestore";
import { dbService } from "../../fbase";
import React, { useEffect, useState } from "react";
import Nweet from "../nweet/Nweet";
import styled from "../profile/NoInfo.module.css";

export const BookmarkReplies = ({ creatorInfo, reNweetsObj, userObj }) => {
  const [repliesBookmark, setRepliesBookmark] = useState([]);
  const [loading, setLoading] = useState(false);

  // 답글 정보 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "replies"));
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filter = userArray.filter((id) =>
        creatorInfo.bookmark?.includes(id.id)
      );
      setRepliesBookmark(filter);
      setLoading(true);
    });
  }, [creatorInfo.bookmark]);

  return (
    <>
      {loading && (
        <>
          {repliesBookmark.length !== 0 ? (
            <div>
              {repliesBookmark?.map((myBook) => (
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
                <h2>아직 저장한 답글이 없습니다</h2>
                <p>지금 일어나는 일을 북마크에 담아보세요.</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
