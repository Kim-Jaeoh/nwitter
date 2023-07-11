import styled from "./SelectNoInfo.module.css";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { dbService } from "../../fbase";
import { useLocation } from "react-router-dom";
import Nweet from "../nweet/Nweet";
import CircleLoader from "../loader/CircleLoader";
import useGetFbInfo from "../../hooks/useGetFbInfo";

const LikeReplies = ({ userObj }) => {
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const [myLikeReplies, setMyLikeReplies] = useState([] || null);
  const [loading, setLoading] = useState(false);
  const { reNweets } = useGetFbInfo();

  // 답글의 좋아요 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "replies"),
      where("like", "array-contains", uid)
    );

    onSnapshot(q, (querySnapshot) => {
      const array = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyLikeReplies(array);
      setLoading(true);
    });
  }, [uid]);

  return (
    <>
      {loading ? (
        <>
          {myLikeReplies.length !== 0 ? (
            <div>
              {myLikeReplies.map((myNweet) => (
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
                <h2>아직 마음에 들어한 답글이 없습니다</h2>
                <p>
                  좋아하는 답글의 하트를 눌러 표시 해보세요. 마음에 들어한
                  답글은 여기에 표시됩니다.
                </p>
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

export default LikeReplies;
