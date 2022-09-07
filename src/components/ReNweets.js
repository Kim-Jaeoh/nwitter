import { useLocation } from "react-router-dom";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { dbService } from "../fbase";
import Nweet from "./Nweet";
import styled from "./ReNweets.module.css";
import DetailNweetReply from "./DetailNweetReply";
import ReNweetsSum from "./ReNweetsSum";

const ReNweets = ({ myNweets, userObj }) => {
  // const location = useLocation();
  // const [creatorInfo, setCreatorInfo] = useState([]);
  const [ogNweets, setOgNweets] = useState([]);
  const [filterReplies, setFilterReplies] = useState([]);
  const [sum, setSum] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  // 답글 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "replies")
      // orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filter = userArray.filter((id) => id.email === userObj.email);
      setFilterReplies(filter);
      setLoading(true);
    });
  }, [userObj.email]);

  // 원글의 답글 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("reNweet", "array-contains", userObj.email)
      // orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOgNweets(userArray);
      setLoading(true);
    });
  }, [userObj.email]);

  // 리트윗, 답글 전개 연산자로
  useEffect(() => {
    const filterSum = [...filterReplies, ...ogNweets];
    const sortSum = filterSum.sort(
      (prev, cur) => cur.createdAt - prev.createdAt
    );
    setSum(sortSum);
  }, [filterReplies, ogNweets]);

  return (
    <>
      {loading && (
        <>
          {sum.length !== 0 && (
            <div>
              {sum.map((filter) => (
                <ReNweetsSum
                  key={filter.id}
                  nweetObj={filter}
                  userObj={userObj}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ReNweets;
