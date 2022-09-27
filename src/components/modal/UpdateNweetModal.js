import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "./UpdateNweetModal.module.css";
import Modal from "@mui/material/Modal";
import noneProfile from "../../image/noneProfile.jpg";
import { GrEmoji } from "react-icons/gr";
import { GrClose } from "react-icons/gr";
import Picker from "emoji-picker-react";
import { useEmojiModalOutClick } from "../../hooks/useEmojiModalOutClick";
import { useHandleResizeTextarea } from "../../hooks/useHandleResizeTextarea";

const UpdateNweetModal = ({
  creatorInfo,
  newNweet,
  setNewNweet,
  nweetAttachment,
  reNweetsObj,
  nweetObj,
  userObj,
  setIsEditing,
  isEditing,
}) => {
  const editRef = useRef();
  const emojiRef = useRef();
  const [filterReNweetId, setFilterReNweetId] = useState({});
  const [select, setSelect] = useState("");

  const handleResizeHeight = useHandleResizeTextarea(editRef);

  const { clickEmoji, toggleEmoji } = useEmojiModalOutClick(emojiRef, editRef);

  const onEmojiClick = (event, emojiObject) => {
    const textEmoji =
      newNweet.slice(0, editRef.current.selectionStart) +
      emojiObject.emoji +
      newNweet.slice(editRef.current.selectionEnd, newNweet.length);
    setNewNweet(textEmoji);
  };

  // 수정된 글 firebase에 업데이트
  useEffect(() => {
    // 답글
    const index = reNweetsObj?.findIndex(
      (obj) => obj?.replyId === nweetObj?.id
    );
    setFilterReNweetId(reNweetsObj[index]);
  }, [nweetObj.id, reNweetsObj, userObj.email]);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  const onSubmit = async (e) => {
    alert("업데이트 되었습니다");
    e.preventDefault();

    if (nweetObj?.parent) {
      // 답글 업뎃
      const repliesRef = doc(dbService, "replies", nweetObj.id);
      await updateDoc(repliesRef, {
        text: newNweet,
        attachmentUrl: nweetObj.attachmentUrl,
      });
    } else {
      // 원글 업뎃
      const nweetsRef = doc(dbService, "nweets", nweetObj.id);
      await updateDoc(nweetsRef, {
        text: newNweet,
        attachmentUrl: nweetObj.attachmentUrl,
      });
    }

    if (filterReNweetId) {
      const reNweetRef = doc(dbService, "reNweets", filterReNweetId.id);
      await updateDoc(reNweetRef, {
        text: newNweet,
      });
    }

    setIsEditing(false);
  };

  return (
    <Modal
      open={isEditing}
      onClose={() => setIsEditing(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <form className={styled.editForm} onSubmit={onSubmit}>
          <div className={styled.topBox}>
            <div className={styled.close} onClick={() => setIsEditing(false)}>
              {/* onClick={toggleEdit}> */}
              <GrClose />
            </div>
            <div className={styled.submit}>
              <input
                type="submit"
                value="수정하기"
                className={styled.editInput__arrow}
                disabled={newNweet === "" && nweetAttachment === ""}
              />
            </div>
          </div>
          <div className={styled.editInput__container}>
            <div className={styled.nweet__profile}>
              <img
                src={creatorInfo.photoURL ? creatorInfo.photoURL : noneProfile}
                alt="profileImg"
                className={styled.profile__image}
              />
            </div>
            <div className={styled.editInput}>
              <div
                className={`${styled.editForm__content} ${
                  select === "text" && styled.focus
                }`}
              >
                <textarea
                  spellCheck="false"
                  className={styled.editInput__input}
                  type="text"
                  value={newNweet}
                  ref={editRef}
                  onChange={onChange}
                  onFocus={() => setSelect("text")}
                  onBlur={() => setSelect("")}
                  onInput={handleResizeHeight}
                  maxLength={280}
                  // style={{ height: isAreaHeight }}
                  placeholder="무슨 일이 일어나고 있나요?"
                />
                <div className={styled.editInput__add}>
                  <div ref={emojiRef} onClick={toggleEmoji}>
                    <div className={styled.editInput__emoji}>
                      <GrEmoji />
                    </div>
                    {clickEmoji && (
                      <div
                        className={`${styled.emoji} 
                    ${clickEmoji ? styled.emoji__block : styled.emoji__hidden}
                  `}
                      >
                        <Picker
                          onEmojiClick={onEmojiClick}
                          disableAutoFocus={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {nweetAttachment && (
                <div className={styled.editForm__attachment}>
                  <img
                    src={nweetAttachment}
                    alt="upload file"
                    style={{
                      backgroundImage: nweetAttachment,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateNweetModal;
