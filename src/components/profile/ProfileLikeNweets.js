import Nweet from "../nweet/Nweet";
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
import CircleLoader from "../loader/CircleLoader";
import useGetFbInfo from "../../hooks/useGetFbInfo";

const LikeNweets = ({ userObj }) => {
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const [myLikeNweets, setMyLikeNweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { reNweets } = useGetFbInfo();

  // 원글의 좋아요 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("like", "array-contains", uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const array = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyLikeNweets(array);
      setLoading(true);
    });

    return () => unsubscribe();
  }, [uid]);

  return (
    <>
      {loading ? (
        <>
          {myLikeNweets.length !== 0 ? (
            <div>
              {myLikeNweets
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((myNweet) => (
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
                <h2>아직 마음에 들어한 트윗이 없습니다</h2>
                <p>
                  좋아하는 트윗의 하트를 눌러 표시 해보세요. 마음에 들어한
                  트윗은 여기에 표시됩니다.
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

export default LikeNweets;
