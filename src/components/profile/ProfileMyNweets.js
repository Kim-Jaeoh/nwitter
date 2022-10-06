import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import Nweet from "../nweet/Nweet";
import styled from "./SelectNoInfo.module.css";

const MyNweets = ({ myNweets, userObj }) => {
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
    });
  }, []);

  return (
    <>
      {myNweets.length !== 0 ? (
        <div>
          {myNweets.map((myNweet, index) => (
            <Nweet
              key={index}
              nweetObj={myNweet}
              reNweetsObj={reNweets}
              userObj={userObj}
              isOwner={myNweet.creatorId === userObj.uid}
            />
          ))}
        </div>
      ) : (
        <div className={styled.noInfoBox}>
          <div className={styled.noInfo}>
            <h2>아직 트윗이 없습니다</h2>
            <p>지금 일어나는 일을 트윗에 담아보세요.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MyNweets;
