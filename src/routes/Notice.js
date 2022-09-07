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
  const [nweets, setNweets] = useState([]);

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
    getMyNweets();
  }, [getMyNweets]);

  return (
    <>
      <div className={styled.container}>
        <TopCategory
          text={"알림"}
          iconName={<IoArrowBackOutline />}
          // creatorInfo={creatorInfo}
        />
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
            <NoticeReNweet userObj={userObj} />
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
