import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";

const NweetFactory = ({ userObj }) => {
  const fileInput = useRef();
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [loading, setLoading] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let attachmentUrl = "";

    // 이미지 없이 텍스트만 업로드 할 때
    if (attachment !== "") {
      //파일 경로 참조 만들기
      const attachmentfileRef = ref(storageService, `${userObj.uid}/${v4()}`);

      //storage 참조 경로로 파일 업로드 하기
      await uploadString(attachmentfileRef, attachment, "data_url");

      //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(ref(attachmentfileRef));
    }

    const attachmentNweet = {
      text: nweet, // nweet: nweet (useState의 nweet 값)
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    // 입력 값 없을 시 업로드 X
    if (nweet !== "") {
      await addDoc(collection(dbService, "nweets"), attachmentNweet);
      setNweet("");
      setAttachment("");
      setLoading(false);
      // fileInput.current.value = ""; // 완료 후 파일 문구 없애기
    } else {
      alert("글자를 입력하세요");
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0]; // 파일 1개만 첨부
    const reader = new FileReader(); // 파일 이름 읽기

    /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
    Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
    if (theFile) {
      reader.readAsDataURL(theFile);
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

  return (
    <>
      {loading && <Loading />} {/* 업로드 후 로딩 시 스피너 */}
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            type="text"
            value={nweet}
            placeholder="What's on your mind?"
            maxLength={120}
            onChange={onChange}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        {attachment && (
          <div className="factoryForm__attachment">
            <img
              src={attachment}
              alt="upload file"
              style={{
                backgroundImage: attachment,
              }}
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default NweetFactory;
