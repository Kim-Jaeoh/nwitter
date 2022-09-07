import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "../fbase";
import { useEffect, useState } from "react";
import Nweet from "./Nweet";

const ExploreNweets = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    // setLoading(true); // 렌더링 후 로딩 스피너 on

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
      // setLoading(false); // obj 부른 후 로딩 종료 시 스피너 off
    });
  }, []);

  return (
    <>
      {nweets.length !== 0 && (
        <div style={{ marginTop: "53px" }}>
          {nweets.map((nweet, index) => (
            <Nweet
              key={nweet.id}
              nweetObj={nweet}
              userObj={userObj}
              type={"nweets"}
              isOwner={nweet.email === userObj.email}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ExploreNweets;
