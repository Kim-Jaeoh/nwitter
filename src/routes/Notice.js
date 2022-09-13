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
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { Route, Switch, useLocation } from "react-router-dom";
import { NoticeReNweet } from "../components/NoticeReNweet";
import { NoticeReply } from "../components/NoticeReply";
import SelectMenuBtn from "../components/SelectMenuBtn";
import { TopCategory } from "../components/TopCategory";
import styled from "./Notice.module.css";
import { useCallback } from "react";

const Notice = ({ userObj }) => {
  const location = useLocation();
  const [selected, setSelected] = useState(1);
  // const [nweets, setNweets] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [other, setOther] = useState([]);
  const [loading, setLoading] = useState(false);

  // // 필터링 방법 (본인이 작성한 것 확인)
  // const getMyNweets = useCallback(() => {
  //   const q = query(
  //     collection(dbService, "nweets"),
  //     where("email", "==", userObj.email),
  //     orderBy("createdAt", "desc")
  //   );

  //   onSnapshot(q, (querySnapshot) => {
  //     const array = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setNweets(array);
  //   });
  // }, [userObj.email]);

  useEffect(() => {
    // getMyNweets();
    return () => setLoading(false);
  }, []);

  // 리트윗 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "reNweets"),
      orderBy("reNweetAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = reNweetArray.filter(
        (asd) => asd.parentEmail === userObj.email
      );

      setReNweets(filter);
      setOther((prev) => [...prev, filter]);
      setLoading(true);
    });
  }, [userObj.email]);

  useEffect(() => {
    if (location.pathname.includes("/renweet")) {
      setSelected(1);
    } else if (location.pathname.includes("/reply")) {
      setSelected(2);
    }
  }, [location.pathname]);

  const onSelect = (num) => {
    setSelected(num);
  };

  useEffect(() => {
    const q = query(collection(dbService, "reNweets"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New city: ", change.doc.data());
        }
        if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
        }
      });
    });
    unsubscribe();
  }, []);

  return (
    <>
      <div className={styled.container}>
        <TopCategory text={"알림"} iconName={<IoArrowBackOutline />} />
        <div className={styled.main__container}>
          <nav className={styled.categoryList}>
            <SelectMenuBtn
              num={1}
              selected={selected}
              onClick={() => onSelect(1)}
              url={"/notice/renweet/"}
              text={"리트윗"}
            />
            <SelectMenuBtn
              num={2}
              selected={selected}
              onClick={() => onSelect(2)}
              url={"/notice/reply"}
              text={"답글"}
            />
          </nav>
        </div>

        <Switch>
          <Route path="/notice/renweet">
            {reNweets?.map((reNweet) => (
              <NoticeReNweet
                key={reNweet.id}
                reNweetsObj={reNweet}
                loading={loading}
              />
            ))}
          </Route>
          <Route path="/notice/reply">
            <NoticeReply userObj={userObj} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default Notice;
