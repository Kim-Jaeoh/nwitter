import { doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { v4 } from "uuid";
import noneProfile from "../image/noneProfile.jpg";
// import {
//   deleteObject,
//   getDownloadURL,
//   ref,
//   uploadString,
// } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setLoginToken } from "../reducer/user";
import styled from "./Profile.module.css";
import imageCompression from "browser-image-compression";

const Profile = ({ refreshUser, userObj }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUsers = useSelector((state) => state.user.currentUser);

  const [newDisplayName, setNewDisplayName] = useState(
    currentUsers.displayName
  );
  const [isEmail, setIsNewEmail] = useState(currentUsers.email);
  const [attachment, setAttachment] = useState(currentUsers.photoURL);
  const [isAddFile, setIsAddFile] = useState(null);
  const [isDeletePhotoURL, setIsDeletePhotoURL] = useState(false);

  // 회원가입 시 디스패치 된 정보 state에 담기
  const [info, setInfo] = useState({
    displayName: currentUsers.displayName,
    email: currentUsers.email,
    photoURL: currentUsers.photoURL,
  });

  // 실시간 정보 가져오기
  const getInfo = useCallback(async () => {
    await onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setInfo(doc.data());
    });
  }, [userObj.email]);

  // 렌더링 시 실시간 정보 가져오고 이메일, 닉네임, 사진 바뀔 때마다 리렌더링(업데이트)
  useEffect(() => {
    getInfo();
    setIsNewEmail(info.email);
    setAttachment(info.photoURL);
    setNewDisplayName(info.displayName);
  }, [getInfo, info.displayName, info.email, info.photoURL]);

  const onLogOutClick = () => {
    authService.signOut();
    dispatch(setLoginToken("logout"));
    dispatch(
      setCurrentUser({
        photoURL: "",
        uid: "",
        displayName: "",
        email: "",
        // description: "",
        // bookmark: [],
        // follower: [],
        // following: [],
        // rejweet: [],
        // bgURL: "",
      })
    );
    history.push("/");
  };
  // // 필터링 방법 (본인이 작성한 것 확인)
  // const getMyNweets = async () => {
  //   const q = query(
  //     collection(dbService, "nweets"),
  //     where("creatorId", "==", userObj.uid),
  //     orderBy("createdAt", "desc")
  //   );

  //   // 위와 같은 방식
  //   // const querySnapshot = await getDocs(collection(dbService, "nweets"),
  //   //   where("creatorId", "==", userObj.uid),
  //   //   orderBy("createdAt", "desc")
  //   // );

  //   const querySnapshot = await getDocs(q);

  //   console.log(querySnapshot.docs.map((doc) => doc.data()));

  //   // forEach은 return 값(반환값)이 없다
  //   // querySnapshot.forEach((doc) => {
  //   //   console.log(doc.id, "HI", doc.data());
  //   // });
  // };

  const onChange = (e, type) => {
    setNewDisplayName(e.target.value);
  };

  // 이미지 압축
  const compressImage = async (image) => {
    try {
      const options = {
        maxSizeMb: 1,
        maxWidthOrHeight: 500,
      };
      return await imageCompression(image, options);
    } catch (e) {
      console.log(e);
    }
  };

  // 이미지 URL로 바꾸는 로직 - hook 예정(useFileChange)
  const onFileChange = async (e) => {
    setIsAddFile(true);
    const theFile = e.target.files[0]; // 파일 1개만 첨부
    const compressedImage = await compressImage(theFile); // 이미지 압축
    const reader = new FileReader(); // 파일 이름 읽기

    reader.onloadend = (finishedEvent) => {
      setAttachment(finishedEvent.currentTarget.result);
    };

    /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
        Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
    if (theFile) {
      reader.readAsDataURL(compressedImage);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await updateDoc(doc(dbService, "users", userObj.email), {
      displayName: newDisplayName, // 바뀐 이름 업데이트
      photoURL: attachment === "" ? noneProfile : attachment,
    });
    await dispatch(
      setCurrentUser({
        uid: currentUsers.uid,
        photoURL: attachment === "" ? noneProfile : attachment,
        email: currentUsers.email,
        displayName: newDisplayName, // 바뀐 이름 디스패치
        // description: info.description,
        // bookmark: currentUsers.bookmark,
        // follower: currentUsers.follower,
        // following: currentUsers.following,
        // rejweet: currentUsers.rejweet,
      })
    );

    if (isDeletePhotoURL) {
      await updateDoc(doc(dbService, "users", userObj.email), {
        photoURL: noneProfile,
      });
      await dispatch(
        setCurrentUser({
          photoURL: noneProfile,
        })
      );
    }

    // refreshUser();
    alert(`닉네임이 '${newDisplayName}'로 변경되었습니다.`);
    history.push("/");
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure your want to delete this nweet?");
    // 이미지 없는 글 삭제 시 에러가 나와서 예외 처리
    // (삭제 시 nweetObj.attachmentUrl로 찾아가기 때문)
    if (ok) {
      setIsDeletePhotoURL(!isDeletePhotoURL);
      setAttachment(noneProfile);
      setIsAddFile(false);
    }
  };

  return (
    <div className={styled.container}>
      <img
        src={attachment}
        alt="current profile"
        style={{
          width: "200px",
          margin: "0 auto",
          marginBottom: "20px",
          border: "1px solid green",
        }}
      />

      <form onSubmit={onSubmit} className={styled.profileForm}>
        <label htmlFor="attach-file" className={styled.factoryInput__label}>
          {attachment !== noneProfile ? (
            <span>Change Photos</span>
          ) : (
            <span>Add Photos</span>
          )}
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
        {attachment !== noneProfile && (
          <div className={styled.factoryForm__attachment}>
            <div className={styled.factoryForm__clear} onClick={onDeleteClick}>
              <span>
                Remove <FontAwesomeIcon icon={faTimes} />
              </span>
            </div>
          </div>
        )}
        <input
          className={styled.formInput}
          type="text"
          value={newDisplayName || ""}
          placeholder="Display name"
          onChange={(e) => onChange(e, "displayName")}
          autoFocus
        />
        <input
          disabled={
            newDisplayName === info.displayName &&
            !isAddFile &&
            !isDeletePhotoURL
          }
          type="submit"
          value="Update Profile"
          className={styled.formBtn}
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span
        className={`${styled.formBtn} ${styled.cancelBtn} ${styled.logOut}`}
        onClick={onLogOutClick}
      >
        Log Out
      </span>
    </div>
  );
};

export default Profile;
