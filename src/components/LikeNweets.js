import Nweet from "./Nweet";
import styled from "./LikeNweets.module.css";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { dbService } from "../fbase";

const LikeNweets = ({ myLikeNweets, userObj }) => {
  const [reNweets, setReNweets] = useState([]);

  // 리트윗 정보
  useEffect(() => {
    const q = query(collection(dbService, "reNweets"));

    onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReNweets(reNweetArray);
      // setLoading(true);
    });
  }, []);

  return (
    <>
      {myLikeNweets.length !== 0 ? (
        <div>
          {myLikeNweets.map((myNweet) => (
            <Nweet
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
              좋아하는 트윗의 하트를 눌러 마음에 들어요 표시를 해보세요. 마음에
              들어한 트윗은 여기에 표시됩니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LikeNweets;
