import { useCallback, useEffect, useRef, useState } from "react";
import styled from "./UpdateNweetModal.module.css";
import Modal from "@mui/material/Modal";
import noneProfile from "../image/noneProfile.jpg";
import { IoClose } from "react-icons/io5";
import { GrEmoji } from "react-icons/gr";
import { GrClose } from "react-icons/gr";
import Picker from "emoji-picker-react";

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

  // 이모지 모달 밖 클릭 시 창 끔
  useEffect(() => {
    if (!clickEmoji) return;
    const handleClick = (e) => {
      // node.contains는 주어진 인자가 자손인지 아닌지에 대한 Boolean 값을 리턴함
      // emojiRef 내의 클릭한 영역의 타겟이 없으면 true
      if (!emojiRef.current.contains(e.target)) {
        setClickEmoji(false);
      }
      if (!editRef.current.contains(e.target)) {
        setFocus(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [clickEmoji]);

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
    >
      <div className={styled.container}>
        <form className={styled.editForm} onSubmit={onSubmit}>
          <div className={styled.topBox}>
            <div className={styled.close} onClick={toggleEdit}>
              <GrClose />
              {/* <IoClose /> */}
            </div>
            <div className={styled.submit}>
              <input
                type="submit"
                value="트윗하기"
                className={styled.editInput__arrow}
                disabled={newNweet === "" && newNweetAttachment === ""}
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
          </div>
          {/* <div className={styled.editInput__add}>
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
                  <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} />
                </div>
              )}
            </div>
            <input
              type="submit"
              value="트윗하기"
              className={styled.editInput__arrow}
              disabled={newNweet === "" && newNweetAttachment === ""}
            />
          </div> */}
        </form>
      </div>
    </Modal>
  );
};

export default UpdateNweetModal;
