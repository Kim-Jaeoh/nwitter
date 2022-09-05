import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import styled from "./DetailNweet.module.css";

import { useLocation } from "react-router-dom";
import { dbService } from "../fbase";
import Nweet from "./Nweet";
import { TopCategory } from "./TopCategory";
import { DetailReplyForm } from "./DetailReplyForm";
import DetailNweetParent from "./DetailNweetParent";
import DetailNweetReply from "./DetailNweetReply";

export const DetailNweet = ({ userObj }) => {
  const location = useLocation();
  const uid = location.pathname.split("/")[2];
  const [creatorInfo, setCreatorInfo] = useState({});
  const [nweets, setNweets] = useState([]);
  const [showReply, setShowReply] = useState("");
  const [loading, setLoading] = useState(false);

  // 계정 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
    return () => setLoading(false);
  }, [userObj]);

  // 원글 정보 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "nweets"));
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(true);

      const parentNweet = userArray.filter((reply) => reply.id === uid);

      setNweets(parentNweet[0]);
    });
    return () => {
      setLoading(false);
    };
  }, [uid]);

  // 답글 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "replies"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapShot) => {
      const replyArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(true);

      const parentNweet = replyArray.filter((reply) => reply.parent === uid);

      setShowReply(parentNweet);
    });
    return () => {
      setLoading(false);
    };
  }, [uid]);

  return (
    <>
      {loading && (
        <>
          <div className={styled.container}>
            <TopCategory text={"트윗"} iconName={<IoArrowBackOutline />} />
          </div>
          <DetailNweetParent nweetObj={nweets} userObj={userObj} />
          <DetailReplyForm
            nweets={nweets}
            loading={loading}
            creatorInfo={creatorInfo}
            userObj={userObj}
          />
          {showReply.map((reply) => (
            <DetailNweetReply
              key={reply.id}
              nweetObj={reply}
              userObj={userObj}
            />
          ))}
        </>
      )}
    </>
  );
};
