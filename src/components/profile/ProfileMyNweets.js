import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import Nweet from "../nweet/Nweet";

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
      {myNweets.length !== 0 && (
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
      )}
    </>
  );
};

export default MyNweets;
