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
  const [creatorInfo, setCreatorInfo] = useState({});
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
      // setLoading(true);
    });
    // return () => setLoading(false);
  }, [userObj]);

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
        <div>
          {nweets.map((nweet, index) => (
            <Nweet key={nweet.id} nweetObj={nweet} userObj={userObj} />
          ))}
        </div>
      )}
    </>
  );
};

export default ExploreNweets;
