import React from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { dbService } from "../fbase";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";

export const NoticeReNweet = ({ userObj, nweetObj }) => {
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [nweets, setNweets] = useState([]);
  const [filterReplies, setFilterReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  // 내 정보 가져오기
  const getMyInfo = useCallback(async () => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
    });
  }, [userObj.email]);

  // 트윗 정보 가져오기
  // useEffect(() => {
  //   const q = query(collection(dbService, "nweets"));
  //   onSnapshot(q, (querySnapShot) => {
  //     const userArray = querySnapShot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     const filter = userArray.filter((id) =>
  //       creatorInfo.bookmark?.includes(id.id)
  //     );
  //     // setNweets(filter);
  //     setNweets(userArray);
  //     setLoading(true);
  //   });
  //   return () => setLoading(false);
  // }, [creatorInfo.bookmark]);

  // 답글 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "replies"),
      orderBy("createdAt", "desc")
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

  // 필터링 방법 (본인이 작성한 것 확인)
  const getMyNweets = useCallback(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("email", "==", userObj.email),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (querySnapshot) => {
      const array = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // const sum = array.map((nweet) => nweet.reNweet);
      // setNweets(sum);
      setNweets(array);
    });
  }, [userObj.email]);

  useEffect(() => {
    getMyInfo();
    getMyNweets();
  }, [getMyInfo, getMyNweets]);

  const timeToString = (timestamp) => {
    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let amPm = "오전";

    if (hours >= 12) {
      amPm = "오후";
      hours = hours - 12;
    }

    let timeString = amPm + " " + hours + ":" + minutes;

    let str =
      // (date.getHours() >= 12 ? "오후 " : "오전 ") +
      timeString +
      " · " +
      date.getFullYear() +
      "년 " +
      Number(date.getMonth() + 1) +
      "월 " +
      date.getDate() +
      "일 ";
    return str;
  };

  console.log(nweets.map((asd) => asd));

  return (
    // <>
    //   <div>{nweetObj.reNweet}님이 리트윗을 했습니다</div>
    //   <div>{nweetObj.like}님이 좋아요를 했습니다</div>
    // </>
    <>
      {nweets.map((nweet) => (
        <div>
          <div>{nweet.reNweet}님이 리트윗을 했습니다</div>
          {/* <div>{nweet.like}님이 좋아요를 했습니다</div> */}
          {/* <div>{nweet.reNweetAt}</div> */}
          {/* <div>{timeToString(nweet.reNweetAt)}</div> */}
        </div>
      ))}
    </>
  );
};
