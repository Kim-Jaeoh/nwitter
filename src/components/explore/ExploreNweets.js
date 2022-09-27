import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useEffect, useState } from "react";
import Nweet from "../nweet/Nweet";

const ExploreNweets = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
    );

    onSnapshot(q, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
      setLoading(true);
    });
  }, []);

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
      {loading && (
        <>
          {nweets.length !== 0 && (
            <div style={{ marginTop: "53px" }}>
              {nweets.map((nweet, index) => (
                <Nweet
                  key={nweet.id}
                  nweetObj={nweet}
                  reNweetsObj={reNweets}
                  userObj={userObj}
                  isOwner={nweet.email === userObj.email}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ExploreNweets;
