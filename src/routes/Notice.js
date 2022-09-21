import React from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { orderByChild } from "firebase/database";
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
import { NoticeFollow } from "../components/NoticeFollow";

const Notice = ({ userObj }) => {
  const location = useLocation();
  const [selected, setSelected] = useState(1);
  const [reNweets, setReNweets] = useState([]);
  const [repliesReNweets, setRepliesReNweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [myInfo, setMyInfo] = useState({});

  // useEffect(() => {
  //   return () => setLoading(false);
  // }, []);

  // 본인 정보 가져오기
  // useEffect(() => {
  //   onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
  //     setMyInfo(doc.data());
  //   });
  // }, [userObj.email]);

  useEffect(() => {
    const q = query(
      collection(dbService, "users"),
      orderBy("followAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = reNweetArray.filter((asd) =>
        asd.following.includes(userObj.email)
      );

      setMyInfo(filter);
    });
  }, [userObj.email]);

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

      const notMe = filter.filter((asd) => asd.email !== userObj.email);

      setReNweets(notMe);
      setLoading(true);
    });
  }, [userObj.email]);

  // // 답글의 리트윗 가져오기
  // useEffect(() => {
  //   const q = query(
  //     collection(dbService, "replies"),
  //     orderBy("reNweetAt", "desc")
  //   );

  //   onSnapshot(q, (snapshot) => {
  //     const reNweetArray = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     const filter = reNweetArray.filter((asd) => asd.email === userObj.email);

  //     const notMe = filter.filter((asd) => asd.reNweet !== userObj.email);

  //     setRepliesReNweets(notMe);
  //     setLoading(true);
  //   });
  // }, [userObj.email]);

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
      const filter = userArray.filter((id) => id.parentEmail === userObj.email);
      const notMe = filter.filter((asd) => asd.email !== userObj.email);

      setReplies(notMe);
      setLoading(true);
    });
  }, [userObj.email]);

  useEffect(() => {
    if (location.pathname.includes("/renweet")) {
      setSelected(1);
    } else if (location.pathname.includes("/reply")) {
      setSelected(2);
    } else if (location.pathname.includes("/follow")) {
      setSelected(3);
    }
  }, [location.pathname]);

  const onSelect = (num) => {
    setSelected(num);
  };

  return (
    <>
      {loading && (
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
                <SelectMenuBtn
                  num={3}
                  selected={selected}
                  onClick={() => onSelect(3)}
                  url={"/notice/follow"}
                  text={"팔로우"}
                />
              </nav>
            </div>

            <Switch>
              <Route path="/notice/renweet">
                <>
                  {reNweets.length !== 0 ? (
                    reNweets?.map((reNweet) => (
                      <NoticeReNweet
                        key={reNweet.id}
                        reNweetsObj={reNweet}
                        loading={loading}
                        userObj={userObj}
                        repliesReNweets={repliesReNweets}
                      />
                    ))
                  ) : (
                    <div className={styled.noInfoBox}>
                      <div className={styled.noInfo}>
                        <h2>아직은 여기에 아무 것도 없습니다.</h2>
                        <p>
                          누군가가 나의 트윗을 리트윗 하면 여기에 표시됩니다.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              </Route>
              <Route path="/notice/reply">
                <>
                  {replies.length !== 0 ? (
                    replies.map((reply) => (
                      <NoticeReply
                        key={reply}
                        userObj={userObj}
                        replyObj={reply}
                        loading={loading}
                      />
                    ))
                  ) : (
                    <div className={styled.noInfoBox}>
                      <div className={styled.noInfo}>
                        <h2>아직은 여기에 아무 것도 없습니다.</h2>
                        <p>
                          누군가가 나의 트윗에 답글을 달면 여기에 표시됩니다.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              </Route>
              <Route path="/notice/follow">
                <>
                  {myInfo ? (
                    myInfo.map((follow, index) => (
                      <NoticeFollow
                        key={index}
                        userObj={userObj}
                        followObj={follow}
                        loading={loading}
                      />
                    ))
                  ) : (
                    <div className={styled.noInfoBox}>
                      <div className={styled.noInfo}>
                        <h2>아직은 여기에 아무 것도 없습니다.</h2>
                        <p>누군가가 나를 팔로우 하면 여기에 표시됩니다.</p>
                      </div>
                    </div>
                  )}
                </>
              </Route>
            </Switch>
          </div>
        </>
      )}
    </>
  );
};

export default Notice;
