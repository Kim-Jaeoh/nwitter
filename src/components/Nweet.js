import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "./Nweet.module.css";
import noneProfile from "../image/noneProfile.jpg";

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [newNweetAttachment, setNewNweetAttachment] = useState(
    nweetObj.attachmentUrl
  );
  const [creatorInfo, setCreatorInfo] = useState({});
  // const currentUsers = useSelector((state) => state.user.currentUser);
  const dbRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const dbAttachmentRef = ref(storageService, newNweetAttachment);

  useEffect(() => {
    onSnapshot(doc(dbService, "users", nweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
    });
  }, [nweetObj]);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure your want to delete this nweet?");
    if (ok === true) {
      // delete nweet
      await deleteDoc(dbRef); // 문서 삭제
    }

    // 이미지 없는 글 삭제 시 에러가 나와서 예외 처리
    // (삭제 시 nweetObj.attachmentUrl로 찾아가기 때문)
    if (newNweetAttachment) {
      await deleteObject(dbAttachmentRef); // 이미지 삭제
    }
  };

  // 함수형 업데이트 = 이전 값
  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(dbRef, {
      text: newNweet,
    });
    setEditing(false);
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

  return (
    <div className={styled.nweet}>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form
                onSubmit={onSubmit}
                className={`${styled.container} ${styled.nweetEdit}`}
              >
                <input
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  onChange={onChange}
                  required
                  autoFocus
                  className={styled.formInput}
                />
                <input
                  type="submit"
                  value="Update Nweet"
                  className={styled.formBtn}
                />
              </form>
              <span
                onClick={toggleEditing}
                className={`${styled.formBtn} ${styled.cancelBtn}`}
              >
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
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
              <div className={styled.nweet__edit}>
                {isOwner && (
                  <div className={styled.nweet__actions}>
                    <span onClick={onDeleteClick}>
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span onClick={toggleEditing}>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className={styled.nweet__text}>
                <h4>{nweetObj.text}</h4>
              </div>
              <div>
                {nweetObj.attachmentUrl && (
                  <img src={nweetObj.attachmentUrl} alt="uploaded file" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nweet;
