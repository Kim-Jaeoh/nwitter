import { useCallback, useEffect, useRef, useState } from "react";
import styled from "./UpdateNweetModal.module.css";
import Modal from "@mui/material/Modal";
import noneProfile from "../image/noneProfile.jpg";
import { GrEmoji } from "react-icons/gr";
import { GrClose } from "react-icons/gr";
import Picker from "emoji-picker-react";
import React from "react";

export const NweetModal = ({
  nweetModal,
  userObj,
  creatorInfo,
  toggleNweetModal,
}) => {
  const editRef = useRef();
  const emojiRef = useRef();
  const [clickEmoji, setClickEmoji] = useState(false);

  useEffect(() => {
    if (!clickEmoji) return;
    const handleClick = (e) => {
      // node.contains는 주어진 인자가 자손인지 아닌지에 대한 Boolean 값을 리턴함
      // emojiRef 내의 클릭한 영역의 타겟이 없으면 true
      if (!emojiRef.current.contains(e.target)) {
        setClickEmoji(false);
      }
      if (!editRef.current.contains(e.target)) {
        // setFocus(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [clickEmoji]);

  return (
    <Modal
      open={nweetModal}
      onClose={toggleNweetModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {/* <div className={styled.container}>
        <form className={styled.editForm} onSubmit={onSubmit}>
          <div className={styled.topBox}>
            <div className={styled.close} onClick={toggleNweetModal}>
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
                  style={{ height: isAreaHeight }}
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
      </div> */}
    </Modal>
  );
};
