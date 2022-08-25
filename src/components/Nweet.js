import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { dbService } from "../fbase";
import styled from "./Nweet.module.css";
import noneProfile from "../image/noneProfile.jpg";
import { FiMoreHorizontal, FiRepeat } from "react-icons/fi";
import NweetEtcBtn from "./NweetEtcBtn";
import UpdateNweetModal from "./UpdateNweetModal";
import {
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
  FaRetweet,
} from "react-icons/fa";

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [newNweetAttachment, setNewNweetAttachment] = useState(
    nweetObj.attachmentUrl
  );
  const [creatorInfo, setCreatorInfo] = useState({});
  const [nweetEtc, setNweetEtc] = useState(false);

  const etcRef = useRef();
  const dbRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const [isAreaHeight, setIsAreaHeight] = useState(""); // Modal에서 textArea 높이값 저장받음

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    onSnapshot(doc(dbService, "users", nweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
    });
  }, [nweetObj]);

  useEffect(() => {
    // nweetEct가 true면 return;으로 인해 함수 종료(렌더 후 클릭 시 에러 방지)
    if (!nweetEtc) return;

    const handleClick = (e) => {
      if (!etcRef.current.contains(e.target)) {
        setNweetEtc(false);
      }
      // else if (etcRef.current === null) {
      // return;
      // }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [nweetEtc]);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  const onSubmit = async (e) => {
    alert("업데이트 되었습니다");
    e.preventDefault();
    await updateDoc(dbRef, {
      text: newNweet,
      attachmentUrl: newNweetAttachment,
    });
    setIsEditing(false);
  };

  const timeToString = (timestamp) => {
    let date = new Date(timestamp);
    let str =
      date.getFullYear() +
      "년 " +
      Number(date.getMonth() + 1) +
      "월 " +
      date.getDate() +
      "일 ";
    return str;
  };

  const toggleNweetEct = useCallback(() => {
    setNweetEtc((prev) => !prev);
  }, []);

  return (
    <>
      <div className={styled.nweet}>
        <div className={styled.nweet__container}>
          <div className={styled.nweet__profile}>
            <img
              src={
                creatorInfo.photoURL
                //  ? creatorInfo.photoURL : noneProfile
              }
              alt="profileImg"
              className={styled.profile__image}
            />
          </div>
          <div className={styled.userInfo}>
            <div className={styled.userInfo__name}>
              <div className={styled.userInfo__one}>
                <p>{creatorInfo.displayName}</p>
              </div>
              <div className={styled.userInfo__two}>
                <p>
                  @{creatorInfo.email ? creatorInfo.email.split("@")[0] : ""}
                </p>
                <p style={{ margin: "0 4px" }}>·</p>
                <p className={styled.nweet__createdAt}>
                  {timeToString(nweetObj.createdAt)}
                </p>
              </div>
            </div>
            {isOwner && (
              <div className={styled.nweet__edit} ref={etcRef}>
                <div
                  className={styled.nweet__editIcon}
                  onClick={toggleNweetEct}
                >
                  <FiMoreHorizontal />
                  <div className={styled.horizontal__bg}></div>
                </div>
                {nweetEtc && (
                  <NweetEtcBtn
                    newNweetAttachment={newNweetAttachment}
                    nweetObj={nweetObj}
                    toggleEdit={toggleEdit}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className={styled.nweet__text}>
          <h4>{nweetObj.text}</h4>
        </div>
        {nweetObj.attachmentUrl ? (
          <div className={styled.nweet__image}>
            <img src={nweetObj.attachmentUrl} alt="uploaded file" />
          </div>
        ) : null}
        <nav className={styled.nweet__actions}>
          <div className={`${styled.actionBox} ${styled.comment}`}>
            <div className={styled.actions__icon}>
              <FaRegComment />
            </div>
            <div className={styled.actions__text}>
              <p>5</p>
            </div>
          </div>
          <div className={`${styled.actionBox} ${styled.retweet}`}>
            <div className={styled.actions__icon}>
              <FaRetweet />
            </div>
            <div className={styled.actions__text}>
              <p>4</p>
            </div>
          </div>
          <div className={`${styled.actionBox} ${styled.like}`}>
            <div className={styled.actions__icon}>
              <FaRegHeart />
            </div>
            <div className={styled.actions__text}>
              <p>15</p>
            </div>
          </div>
          <div className={`${styled.actionBox} ${styled.bookmark}`}>
            <div className={styled.actions__icon}>
              <FaRegBookmark />
            </div>
          </div>
        </nav>
      </div>
      {isEditing && (
        <UpdateNweetModal
          creatorInfo={creatorInfo}
          setNewNweet={setNewNweet}
          onChange={onChange}
          onSubmit={onSubmit}
          newNweet={newNweet}
          newNweetAttachment={newNweetAttachment}
          setNewNweetAttachment={setNewNweetAttachment}
          isEditing={isEditing}
          toggleEdit={toggleEdit}
          isAreaHeight={isAreaHeight}
          setIsAreaHeight={setIsAreaHeight}
        />
      )}
    </>
  );
};

export default Nweet;
