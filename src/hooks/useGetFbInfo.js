import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "../fbase";
import { useSelector } from "react-redux";

const useGetFbInfo = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [myInfo, setMyInfo] = useState(null);
  const [reNweets, setReNweets] = useState([]);

  // 본인 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", currentUser.email),
      (doc) => {
        setMyInfo(doc.data());
      }
    );

    return () => unsubscribe();
  }, [currentUser.email]);

  // 리트윗 정보
  useEffect(() => {
    const q = query(
      collection(dbService, "reNweets"),
      orderBy("reNweetAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReNweets(reNweetArray);
    });

    return () => unsubscribe();
  }, []);

  return { myInfo, reNweets };
};

export default useGetFbInfo;
