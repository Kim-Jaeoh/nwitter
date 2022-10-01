import React, { useCallback, useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { IoCloseSharp, IoImageOutline } from "react-icons/io5";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { GrEmoji } from "react-icons/gr";
import Picker from "emoji-picker-react";
import { v4 } from "uuid";
import { dbService, storageService } from "../../fbase";
import imageCompression from "browser-image-compression";
import styled from "./DetailReplyForm.module.css";
import { useHistory } from "react-router-dom";
import { useEmojiModalOutClick } from "../../hooks/useEmojiModalOutClick";
import { useHandleResizeTextarea } from "../../hooks/useHandleResizeTextarea";
import BarLoader from "../loader/BarLoader";
import { useDispatch, useSelector } from "react-redux";
import { setNotModal, setProgressBar } from "../../reducer/user";

export const DetailReplyForm = ({
  loading,
  userObj,
  nweetObj,
  creatorInfo,
  replyModal,
  setReplyModal,
}) => {
  const history = useHistory();
  const fileInput = useRef();
  const textRef = useRef();
  const emojiRef = useRef();
  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState("");
  const [select, setSelect] = useState("");
  const dispatch = useDispatch();
  const currentProgressBar = useSelector((state) => state.user.load);

  const handleResizeHeight = useHandleResizeTextarea(textRef);

  // 이모지 모달 밖 클릭 시 창 끔
  const { clickEmoji, toggleEmoji } = useEmojiModalOutClick(emojiRef, textRef);

  const onEmojiClick = (event, emojiObject) => {
    const textEmoji =
      reply.slice(0, textRef.current.selectionStart) +
      emojiObject.emoji +
      reply.slice(textRef.current.selectionEnd, reply.length);
    setReply(textEmoji);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    dispatch(setProgressBar({ load: true }));

    // 입력 값 없을 시 업로드 X
    if (reply !== "") {
      // 이미지 있을 때만 첨부
      if (attachment !== "") {
        //파일 경로 참조 만들기
        const attachmentfileRef = ref(storageService, `${userObj.uid}/${v4()}`);

        //storage 참조 경로로 파일 업로드 하기
        await uploadString(attachmentfileRef, attachment, "data_url");

        //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
        attachmentUrl = await getDownloadURL(ref(attachmentfileRef));
      }

      const _nweetReply = {
        text: reply,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        email: userObj.email,
        attachmentUrl,
        like: [],
        reNweet: [],
        reNweetAt: [],
        parent: nweetObj.id,
        parentText: nweetObj.text,
        parentEmail: nweetObj.email,
        replyId: [],
        reNweetEmail: [],
        isReply: true,
      };

      setTimeout(async () => {
        dispatch(setProgressBar({ load: false }));
        const replies = await addDoc(
          collection(dbService, "replies"),
          _nweetReply
        );
        await updateDoc(doc(dbService, "nweets", nweetObj.id), {
          replyId: [...nweetObj?.replyId, replies.id],
        });
        setReply("");
        setAttachment("");
        setSelect("");

        if (!replyModal) {
          textRef.current.style.height = "52px";
        } else {
          setReplyModal(false);
        }
        dispatch(setNotModal({ modal: true }));
      }, 500);

      return () => clearTimeout();
    } else {
      alert("글자를 입력하세요");
    }
  };

  const onChange = useCallback((e) => {
    setReply(e.target.value);
  }, []);

  // 이미지 압축
  const compressImage = async (image) => {
    try {
      const options = {
        maxSizeMb: 1,
        maxWidthOrHeight: 800,
      };
      return await imageCompression(image, options);
    } catch (error) {
      console.log(error);
    }
  };

  const onFileChange = async (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0]; // 파일 1개만 첨부
    const compressedImage = await compressImage(theFile); // 이미지 압축
    const reader = new FileReader(); // 파일 이름 읽기

    /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
        Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
    if (theFile) {
      reader.readAsDataURL(compressedImage);
    }

    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
  };

  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = ""; // 취소 시 파일 문구 없애기
  };

  const goPage = () => {
    history.push("/profile/mynweets/" + nweetObj.email);
  };

  return (
    <>
      {/* {currentProgressBar?.load && replyModal === false && <BarLoader />} */}
      <div
        className={`${styled.nweet__reply} ${
          select === "text" && styled.select
        } `}
      >
        <div className={styled.nweet__replyIcon}>{/* <BsReplyFill /> */}</div>
        <div className={styled.nweet__replyText}>
          <p onClick={goPage}>@{nweetObj.email?.split("@")[0]}</p>
          <p>&nbsp;님에게 보내는 답글</p>
        </div>
      </div>
      <div
        className={`${styled.factoryForm} ${replyModal && styled.modalBorder}`}
      >
        <div className={styled.factoryInput__container}>
          <div className={styled.nweet__profile}>
            {loading && (
              <img
                src={creatorInfo.photoURL}
                alt="profileImg"
                className={styled.profile__image}
              />
            )}
          </div>
          <form onSubmit={onSubmit} className={styled.factoryInput}>
            <div
              className={`${styled.factoryForm__content} ${
                select === "text" && styled.focus
              }`}
            >
              <textarea
                spellCheck="false"
                className={styled.factoryInput__input}
                type="text"
                value={reply}
                ref={textRef}
                onChange={onChange}
                onFocus={() => setSelect("text")}
                // onBlur={() => setSelect("")}
                onInput={handleResizeHeight}
                maxLength={280}
                placeholder="내 답글을 트윗합니다."
              />
              {attachment && (
                <div className={styled.factoryForm__attachment}>
                  <div className={styled.factoryForm__Image}>
                    <img
                      src={attachment}
                      alt="upload file"
                      style={{
                        backgroundImage: attachment,
                      }}
                    />
                  </div>
                  <div
                    className={styled.factoryForm__clear}
                    onClick={onClearAttachment}
                  >
                    <IoCloseSharp />
                  </div>
                </div>
              )}
            </div>
            <div className={styled.factoryInput__add}>
              <div className={styled.factoryInput__iconBox}>
                <label
                  htmlFor="attach-file"
                  className={styled.factoryInput__label}
                >
                  <div className={styled.factoryInput__icon}>
                    <IoImageOutline />
                  </div>
                </label>
                <input
                  ref={fileInput}
                  id="attach-file"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </div>
              <div
                ref={emojiRef}
                onClick={toggleEmoji}
                className={styled.factoryInput__iconBox}
              >
                <div
                  className={`${styled.factoryInput__icon} ${styled.emoji__icon}`}
                >
                  <GrEmoji />
                </div>
                {/* 해결: clickEmoji이 true일 때만 실행해서textarea 버벅이지 않음 */}
                {clickEmoji && (
                  <div
                    className={`${styled.emoji} ${
                      clickEmoji ? styled.emoji__block : styled.emoji__hidden
                    }`}
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
                value="답글"
                className={styled.factoryInput__arrow}
                disabled={reply === "" && attachment === ""}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
