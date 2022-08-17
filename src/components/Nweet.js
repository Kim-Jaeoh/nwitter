import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { dbService } from "../fbase";
import styled from "./Nweet.module.css";
import noneProfile from "../image/noneProfile.jpg";
import { FiMoreHorizontal } from "react-icons/fi";
import ModifyBtn from "./ModifyBtn";
import UpdateNweetModal from "./UpdateNweetModal";

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [newNweetAttachment, setNewNweetAttachment] = useState(
    nweetObj.attachmentUrl
  );
  const [creatorInfo, setCreatorInfo] = useState({});
  const [nweetEct, setNweetEct] = useState(false);

  const etcRef = useRef();
  const dbRef = doc(dbService, "nweets", `${nweetObj.id}`);
  // const dbAttachmentRef = ref(storageService, newNweetAttachment);

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    console.log(isEditing);
  };

  useEffect(() => {
    onSnapshot(doc(dbService, "users", nweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
    });
  }, [nweetObj]);

  useEffect(() => {
    // if (!nweetEct) return;
    const handleClick = (e) => {
      if (!etcRef.current.contains(e.target)) {
        setNweetEct(false);
      }
      // else if (etcRef.current === null) {
      // return;
      // }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

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
    setNweetEct((prev) => !prev);
  }, []);

  return (
    <>
      <div className={styled.nweet}>
        <div className={styled.nweet__container}>
          <div className={styled.nweet__profile}>
            <img
              src={creatorInfo.photoURL ? creatorInfo.photoURL : noneProfile}
              alt="profileImg"
              className={styled.profile__image}
            />
          </div>
          <div className={styled.userInfo}>
            <div className={styled.userInfo__top}>
              <div className={styled.userInfo__name}>
                <p>{creatorInfo.displayName}</p>
                <p>
                  @{creatorInfo.email ? creatorInfo.email.split("@")[0] : ""}
                </p>
                <p style={{ margin: "0 4px" }}>·</p>
                <p className={styled.nweet__createdAt}>
                  {timeToString(nweetObj.createdAt)}
                </p>
              </div>
              {isOwner && (
                <div className={styled.nweet__edit} ref={etcRef}>
                  <div
                    className={styled.nweet__actions}
                    onClick={toggleNweetEct}
                  >
                    <FiMoreHorizontal />
                    <div className={styled.horizontal__bg}></div>
                  </div>
                  {nweetEct && (
                    <ModifyBtn
                      newNweetAttachment={newNweetAttachment}
                      nweetObj={nweetObj}
                      toggleEdit={toggleEdit}
                    />
                  )}
                </div>
              )}
            </div>
            <div>
              <div className={styled.nweet__text}>
                <h4>{nweetObj.text}</h4>
              </div>
            </div>
          </div>
        </div>
        {nweetObj.attachmentUrl ? (
          <div className={styled.nweet__image}>
            <img src={nweetObj.attachmentUrl} alt="uploaded file" />
          </div>
        ) : null}
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
        />
      )}
    </>
  );
};

export default Nweet;