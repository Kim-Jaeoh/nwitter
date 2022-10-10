import React from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "../fbase";
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { Route, Switch, useLocation } from "react-router-dom";
import { NoticeReNweet } from "../components/notice/NoticeReNweet";
import { NoticeReply } from "../components/notice/NoticeReply";
import SelectMenuBtn from "../components/button/SelectMenuBtn";
import { TopCategory } from "../components/topCategory/TopCategory";
import styled from "./Notice.module.css";
import { NoticeFollow } from "../components/notice/NoticeFollow";
import CircleLoader from "../components/loader/CircleLoader";

const Notice = ({ userObj }) => {
  const location = useLocation();
  const [selected, setSelected] = useState(1);
  const [reNweets, setReNweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [myFollowerInfo, setMyFollowerInfo] = useState({});
  const [userInfo, setUserInfo] = useState([]);

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setUserInfo(doc.data());
      setLoading(true);
    });
  }, [userObj]);

  // 본인 팔로워 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "users"),
      orderBy("followingAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = reNweetArray.filter((obj) =>
        obj.following.includes(userObj.email)
      );

      setMyFollowerInfo(filter);
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
        (obj) =>
          obj.email !== userObj.email &&
          (obj?.replyEmail ? obj?.replyEmail : obj?.parentEmail) ===
            userObj.email
      );

      setReNweets(filter);
      setLoading(true);
    });
  }, [userObj.email]);

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

      const filter = userArray.filter((id) => id.parentEmail === userObj.email);
      const notMe = filter.filter((obj) => obj.email !== userObj.email);

      setReplies(notMe);
      setLoading(true);
    });
  }, [userObj.email]);

  useEffect(() => {
    if (location.pathname.includes("/renweets")) {
      setSelected(1);
    } else if (location.pathname.includes("/replies")) {
      setSelected(2);
    } else if (location.pathname.includes("/followers")) {
      setSelected(3);
    }
  }, [location.pathname]);

  return (
    <>
      <div className={styled.container}>
        <TopCategory text={"알림"} iconName={<IoArrowBackOutline />} />
        <div className={styled.main__container}>
          <nav className={styled.categoryList}>
            <SelectMenuBtn
              num={1}
              selected={selected}
              url={"/notice/renweets/"}
              text={"리트윗"}
            />
            <SelectMenuBtn
              num={2}
              selected={selected}
              url={"/notice/replies"}
              text={"답글"}
            />
            <SelectMenuBtn
              num={3}
              selected={selected}
              url={"/notice/followers"}
              text={"팔로우"}
            />
          </nav>
        </div>

        {loading ? (
          <Switch>
            <Route path="/notice/renweets">
              <>
                {reNweets.length !== 0 ? (
                  reNweets?.map((reNweet, index) => (
                    <NoticeReNweet
                      key={reNweet.id}
                      reNweetsObj={reNweet}
                      loading={loading}
                      userObj={userObj}
                    />
                  ))
                ) : (
                  <div className={styled.noInfoBox}>
                    <div className={styled.noInfo}>
                      <h2>아직은 여기에 아무 것도 없습니다.</h2>
                      <p>누군가가 나의 트윗을 리트윗 하면 여기에 표시됩니다.</p>
                    </div>
                  </div>
                )}
              </>
            </Route>
            <Route path="/notice/replies">
              <>
                {replies.length !== 0 ? (
                  replies?.map((reply) => (
                    <NoticeReply
                      key={reply.id}
                      userObj={userObj}
                      replyObj={reply}
                      loading={loading}
                    />
                  ))
                ) : (
                  <div className={styled.noInfoBox}>
                    <div className={styled.noInfo}>
                      <h2>아직은 여기에 아무 것도 없습니다.</h2>
                      <p>누군가가 나의 트윗에 답글을 달면 여기에 표시됩니다.</p>
                    </div>
                  </div>
                )}
              </>
            </Route>
            <Route path="/notice/followers">
              <>
                {myFollowerInfo.length !== 0 ? (
                  myFollowerInfo.map((follow, index) => (
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
        ) : (
          <CircleLoader />
        )}
      </div>
    </>
  );
};

export default Notice;
