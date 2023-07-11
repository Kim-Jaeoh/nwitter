import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useEffect, useState } from "react";
import Nweet from "../nweet/Nweet";
import CircleLoader from "../loader/CircleLoader";
import useGetFbInfo from "../../hooks/useGetFbInfo";

const ExploreNweets = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { reNweets } = useGetFbInfo();

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
      setLoading(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading ? (
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
      ) : (
        <CircleLoader height={60} />
      )}
    </>
  );
};

export default ExploreNweets;
