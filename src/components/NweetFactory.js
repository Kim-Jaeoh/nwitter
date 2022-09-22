import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { IoCloseSharp, IoImageOutline } from "react-icons/io5";
import { GrClose, GrEmoji } from "react-icons/gr";
import Loading from "./Loading";
import styled from "./NweetFactory.module.css";
import noneProfile from "../image/noneProfile.jpg";
import Picker from "emoji-picker-react";
import imageCompression from "browser-image-compression";

const NweetFactory = ({ userObj, placeholderText }) => {
  const fileInput = useRef();
  const textRef = useRef();
  const emojiRef = useRef();
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState({});
  const [clickEmoji, setClickEmoji] = useState(false);
  const [select, setSelect] = useState("");

  // useEffect(() => {
  //   return () => setLoading(false);
  // }, []);

  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
    return () => setLoading(false);
  }, [userObj]);

  // 이모지 모달 밖 클릭 시 창 끔
  useEffect(() => {
    if (!clickEmoji) return;
    const handleClick = (e) => {
      // node.contains는 주어진 인자가 자손인지 아닌지에 대한 Boolean 값을 리턴함
      // emojiRef 내의 클릭한 영역의 타겟이 없으면 true
      if (!emojiRef.current.contains(e.target)) {
        setClickEmoji(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [clickEmoji]);

  useEffect(() => {
    textRef.current.style.height = "50px";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, [textRef]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let attachmentUrl = "";

    // 입력 값 없을 시 업로드 X
    if (nweet !== "") {
      // 이미지 있을 때만 첨부
      if (attachment !== "") {
        //파일 경로 참조 만들기
        const attachmentfileRef = ref(storageService, `${userObj.uid}/${v4()}`);

        //storage 참조 경로로 파일 업로드 하기
        await uploadString(attachmentfileRef, attachment, "data_url");

        //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
        attachmentUrl = await getDownloadURL(ref(attachmentfileRef));
      }

      const attachmentNweet = {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
        email: userObj.email,
        like: [],
        reNweet: [],
        // reNweetAt: [],
        replyId: [],
      };

      await addDoc(collection(dbService, "nweets"), attachmentNweet);
      setIsLoading(false);
      setNweet("");
      setAttachment("");
      // textRef.current.value = "";
    } else {
      alert("글자를 입력하세요");
      setIsLoading(false);
    }

    textRef.current.style.height = "50px";
  };

  const onChange = useCallback((e) => {
    setNweet(e.target.value);
    // console.log(nweet);
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

  // 메세지 글자 수(높이)에 따라 인풋창 크기 조절
  const handleResizeHeight = useCallback(() => {
    if (textRef === null || textRef.current === null) {
      return;
    }
    textRef.current.style.height = "50px";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  const toggleEmoji = () => {
    setClickEmoji(!clickEmoji);
    if (clickEmoji) {
      setClickEmoji(true);
      textRef.current.focus();
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    const textEmoji =
      nweet.slice(0, textRef.current.selectionStart) +
      emojiObject.emoji +
      nweet.slice(textRef.current.selectionEnd, nweet.length);
    setNweet(textEmoji);
  };

  return (
    <>
      {isLoading && <Loading />} {/* 업로드 후 로딩 시 스피너 */}
      <div className={styled.factoryForm}>
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
                value={nweet}
                ref={textRef}
                onChange={onChange}
                onFocus={() => setSelect("text")}
                onBlur={() => setSelect("")}
                onInput={handleResizeHeight}
                maxLength={280}
                placeholder="무슨 일이 일어나고 있나요?"
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
                className={styled.factoryInput__arrow}
                disabled={nweet === "" && attachment === ""}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NweetFactory;
