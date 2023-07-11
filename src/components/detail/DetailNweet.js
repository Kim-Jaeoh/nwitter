import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { dbService } from "../../fbase";
import { TopCategory } from "../topCategory/TopCategory";
import { DetailReplyForm } from "./DetailReplyForm";
import DetailNweetParent from "./DetailNweetParent";
import DetailNweetReply from "./DetailNweetReply";
import { useSelector } from "react-redux";
import BarLoader from "../loader/BarLoader";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const DetailNweet = ({ userObj }) => {
  const currentProgressBar = useSelector((state) => state.user.load);
  const currentNotModal = useSelector((state) => state.user.modal);
  const [nweets, setNweets] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [replies, setReplies] = useState("");
  const location = useLocation();
  const history = useHistory();
  const uid = location.pathname.split("/")[2];

  // 리트윗 가져오기
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
  }, [userObj.email]);

  // 원글 정보 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "nweets"));
    const unsubscribe = onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const parentNweet = userArray.filter((reply) => reply.id === uid);

      if (!parentNweet[0]) {
        return history.goBack();
      }

      setNweets(parentNweet[0]);
    });

    return () => unsubscribe();
  }, [history, uid]);

  // 답글 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "replies"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapShot) => {
      const replyArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const parentNweet = replyArray.filter((reply) => reply.parent === uid);

      setReplies(parentNweet);
    });

    return () => unsubscribe();
  }, [uid]);

  return (
    <>
      {nweets && reNweets && replies && (
        <>
          <TopCategory text={"트윗"} iconName={<IoArrowBackOutline />} />
          <DetailNweetParent
            nweetObj={nweets}
            userObj={userObj}
            reNweetsObj={reNweets}
          />
          {currentProgressBar?.load && currentNotModal.modal && <BarLoader />}
          <DetailReplyForm nweetObj={nweets} userObj={userObj} />
          {replies &&
            replies.map((reply) => (
              <DetailNweetReply
                key={reply.id}
                nweets={nweets}
                reNweetsObj={reNweets}
                nweetObj={reply}
                userObj={userObj}
              />
            ))}
        </>
      )}
    </>
  );
};
