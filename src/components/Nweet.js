import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [newNweetAttachment, setNewNweetAttachment] = useState(
    nweetObj.attachmentUrl
  );

  const dbRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const dbAttachmentRef = ref(storageService, nweetObj.attachmentUrl);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(dbRef, {
      text: newNweet,
      attachmentUrl: newNweetAttachment,
      displayName: userObj.displayName, // 닉네임 변경 후 업로드 수정 시 변경된 닉네임 노출
    });
    setEditing(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container nweetEdit">
                <input
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  onChange={onChange}
                  required
                  autoFocus
                  className="formInput"
                />
                <input type="submit" value="Update Nweet" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h3>{nweetObj.displayName}</h3>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} alt="uploaded file" />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
