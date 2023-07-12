import Nweet from "../nweet/Nweet";
import styled from "./SelectNoInfo.module.css";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { dbService } from "../../fbase";
import CircleLoader from "../loader/CircleLoader";
import useGetFbInfo from "../../hooks/useGetFbInfo";

const LikeNweets = ({ userObj }) => {
  const [myLikeNweets, setMyLikeNweets] = useState([]);
  const { reNweets } = useGetFbInfo();
  const [loading, setLoading] = useState(false);

  // 원글의 좋아요 정보 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "nweets"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const array = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filterArr = array.filter((arr) =>
        arr.like.some((like) => like.email === userObj.email)
      );

      const sortArr = filterArr
        .map((arr) => {
          const filter = arr.like.filter(
            (like) => like?.email === userObj.email
          );
          return { id: arr.id, likeAt: filter[0].likeAt, ...arr };
        })
        .sort((a, b) => b.likeAt - a.likeAt);

      setMyLikeNweets(sortArr);
      setLoading(true);
    });

    return () => {
      unsubscribe();
    };
  }, [userObj.email]);

  return (
    <>
      {loading ? (
        <>
          {myLikeNweets.length !== 0 ? (
            <div>
              {myLikeNweets.map((myNweet) => (
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
