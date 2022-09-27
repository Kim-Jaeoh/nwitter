import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import styled from "./NoInfo.module.css";
import NweetsSum from "../nweet/NweetsSum";

const ReNweets = ({ userObj }) => {
  const [ogNweets, setOgNweets] = useState([]);
  const [sum, setSum] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [replyReNweet, setReplyReNweet] = useState([]);
  const [loading, setLoading] = useState(false);

  // 리트윗, 답글 전개 연산자 복사 및 시간 순서대로 정렬
  useEffect(() => {
    const filterSum = [...replyReNweet, ...ogNweets];
    const sortSum = filterSum.sort(
      (prev, cur) => cur.reNweetAt - prev.reNweetAt
    );
    setSum(sortSum);
  }, [replyReNweet, ogNweets]);

  // 리트윗 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "reNweets"),
      // where("email", "==", userObj.email),
      orderBy("reNweetAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReNweets(reNweetArray);
      setLoading(true);
    });
  }, [userObj.email]);

  // 원글의 리트윗 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("reNweet", "array-contains", userObj.email)
    );
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOgNweets(userArray);
    });
  }, [userObj.email]);

  // 답글의 리트윗 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "replies"),
      where("reNweet", "array-contains", userObj.email)
    );
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReplyReNweet(userArray);
    });
  }, [userObj.email]);

  return (
    <>
      {loading && (
        <>
          {sum.length !== 0 ? (
            <div>
              {sum.map((myNweet) => (
                <NweetsSum
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
                <h2>아직 리트윗이 없습니다</h2>
                <p>좋은 트윗을 알리고 싶다면 리트윗을 눌러 표시를 해보세요.</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ReNweets;
