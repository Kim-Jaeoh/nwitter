import { useCallback, useEffect, useRef, useState } from "react";
import styled from "./UpdateNweetModal.module.css";
import Modal from "@mui/material/Modal";
import noneProfile from "../image/noneProfile.jpg";
import { IoImageOutline } from "react-icons/io5";
import { GrEmoji } from "react-icons/gr";
import Picker from "emoji-picker-react";
import { deleteObject, ref } from "firebase/storage";
import { storageService } from "../fbase";

const UpdateNweetModal = ({
  creatorInfo,
  newNweet,
  setNewNweet,
  newNweetAttachment,
  setNewNweetAttachment,
  onChange,
  onSubmit,
  isEditing,
  toggleEdit,
}) => {
  const editRef = useRef();
  const emojiRef = useRef();
  const [clickEmoji, setClickEmoji] = useState(false);
  const [attachment, setAttachment] = useState(newNweetAttachment);
  const [focus, setFocus] = useState(false);

  // useEffect(() => {
  //   if (isEditing) {
  //     editRef.current.focus();
  //   }
  // }, [isEditing]);

  const onClick = useCallback(
    (e) => {
      setFocus(!focus);
      editRef.current.focus();
      console.log(focus);
    },
    [focus]
  );

  // 메세지 글자 수(높이)에 따라 인풋창 크기 조절
  const handleResizeHeight = useCallback(() => {
    if (editRef === null || editRef.current === null) {
      return;
    }
    editRef.current.style.height = "50px";
    editRef.current.style.height = editRef.current.scrollHeight + "px";
  }, []);

  const toggleEmoji = () => {
    setClickEmoji(!clickEmoji);
    if (clickEmoji) {
      setClickEmoji(true);
      editRef.current.focus();
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    const textEmoji =
      newNweet.slice(0, editRef.current.selectionStart) +
      emojiObject.emoji +
      newNweet.slice(editRef.current.selectionEnd, newNweet.length);
    setNewNweet(textEmoji);
  };

  return (
    <Modal
      open={isEditing}
      onClose={toggleEdit}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className={styled.container}
    >
      <div className={styled.editForm}>
        <div className={styled.editInput__container}>
          <div className={styled.nweet__profile}>
            <img
              src={creatorInfo.photoURL ? creatorInfo.photoURL : noneProfile}
              alt="profileImg"
              className={styled.profile__image}
            />
          </div>
          <form onSubmit={onSubmit} className={styled.editInput}>
            <div className={styled.editForm__content}>
              <textarea
                spellCheck="false"
                className={`${styled.editInput__input} ${
                  focus && styled.focus
                }`}
                type="text"
                value={newNweet}
                ref={editRef}
                onChange={onChange}
                onClick={onClick}
                onInput={handleResizeHeight}
                maxLength={280}
                placeholder="무슨 일이 일어나고 있나요?"
              />
              {attachment && (
                <div className={styled.editForm__attachment}>
                  <img
                    src={attachment}
                    alt="upload file"
                    style={{
                      backgroundImage: attachment,
                    }}
                  />
                </div>
              )}
            </div>
            <div className={styled.editInput__add}>
              <div ref={emojiRef} onClick={toggleEmoji}>
                <div className={styled.editInput__emoji}>
                  <GrEmoji />
                </div>
                {/* 해결: clickEmoji이 true일 때만 실행해서textarea 버벅이지 않음 */}
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
              <input
                type="submit"
                value="트윗하기"
                className={styled.editInput__arrow}
                disabled={newNweet === "" && newNweetAttachment === ""}
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateNweetModal;
