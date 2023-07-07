import { useRef, useState } from "react";
import styled from "./UpdateProfileModal.module.css";
import Modal from "@mui/material/Modal";
import bgImg from "../../image/bgimg.jpg";
import noneProfile from "../../image/noneProfile.jpg";
import { GrClose } from "react-icons/gr";
import { setCurrentUser } from "../../reducer/user";
import { useDispatch, useSelector } from "react-redux";
import { dbService } from "../../fbase";
import { doc, updateDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import {
  IoCameraOutline,
  IoCameraReverseOutline,
  IoCloseSharp,
} from "react-icons/io5";

const UpdateProfileModal = ({ creatorInfo, isEditing, toggleEdit }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [newDisplayName, setNewDisplayName] = useState(creatorInfo.displayName);
  const [desc, setDesc] = useState(creatorInfo.description);
  const [editAttachment, setEditAttachment] = useState(creatorInfo.photoURL);
  const [editAttachmentBg, setEditAttachmentBg] = useState(creatorInfo.bgURL);
  const [isDeleteProfileURL, setIsDeleteProfileURL] = useState(false);
  const [isDeleteBgURL, setIsDeleteBgURL] = useState(false);
  const [isAddFile, setIsAddFile] = useState(null);
  const [select, setSelect] = useState("");

  const onChangeInfo = (e, type) => {
    if (type === "displayName") {
      setNewDisplayName(e.target.value);
    } else if (type === "description") {
      setDesc(e.target.value);
    }
  };

  // 이미지 압축
  const compressImage = async (image) => {
    try {
      const options = {
        maxSizeMb: 1,
        maxWidthOrHeight: 600,
      };
      return await imageCompression(image, options);
    } catch (e) {
      console.log(e);
    }
  };

  // 이미지 URL로 바꾸는 로직
  const onFileChange = async (e, type) => {
    setIsAddFile(true);
    const theFile = e.target.files[0]; // 파일 1개만 첨부
    const compressedImage = await compressImage(theFile); // 이미지 압축
    const reader = new FileReader(); // 파일 이름 읽기

    reader.onloadend = (finishedEvent) => {
      if (type === "profile") {
        setEditAttachment(finishedEvent.currentTarget.result);
      } else {
        setEditAttachmentBg(finishedEvent.currentTarget.result);
      }
    };

    /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
          Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
    if (theFile) {
      reader.readAsDataURL(compressedImage);
    }
  };

  const onDeleteClick = async (type) => {
    const profilType = type === "profile";
    const confirmMessage = profilType
      ? "프로필 사진을 삭제하시겠어요?"
      : "배경사진을 삭제하시겠어요?";
    const setDeleteType = profilType ? setIsDeleteProfileURL : setIsDeleteBgURL;
    const setEditType = profilType ? setEditAttachment : setEditAttachmentBg;

    const ok = window.confirm(confirmMessage);
    // 이미지 없는 글 삭제 시 에러가 나와서 예외 처리
    // (삭제 시 nweetObj.attachmentUrl로 찾아가기 때문)
    if (ok) {
      setDeleteType(true);
      setEditType(profilType ? noneProfile : bgImg);
      setIsAddFile(false);
    }
  };

  // 업데이트 버튼
  const onSubmit = async (e) => {
    e.preventDefault();

    await updateDoc(doc(dbService, "users", creatorInfo.email), {
      displayName: newDisplayName, // 바뀐 이름 업데이트
      photoURL: editAttachment,
      bgURL: editAttachmentBg,
      description: desc,
    });

    dispatch(
      setCurrentUser({
        displayName: newDisplayName, // 바뀐 이름 디스패치
        photoURL: editAttachment,
        bgURL: editAttachmentBg,
        description: desc,
        ...currentUser,
      })
    );

    // 프로필 이미지 삭제 버튼 클릭 시
    if (isDeleteProfileURL) {
      await updateDoc(doc(dbService, "users", creatorInfo.email), {
        photoURL: noneProfile,
      });
      dispatch(
        setCurrentUser({
          photoURL: noneProfile,
          displayName: newDisplayName,
          description: desc,
          ...currentUser,
        })
      );
    }

    // 배경 이미지 삭제 버튼 클릭 시
    if (isDeleteBgURL) {
      await updateDoc(doc(dbService, "users", creatorInfo.email), {
        bgURL: bgImg,
      });
      dispatch(
        setCurrentUser({
          bgURL: bgImg,
          displayName: newDisplayName,
          description: desc,
          ...currentUser,
        })
      );
    }

    alert(`프로필이 수정되었습니다.`);
    toggleEdit(false);
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
            </div>
            <div className={styled.submit}>
              <input
                type="submit"
                value="프로필 수정"
                className={styled.editInput__arrow}
                disabled={
                  newDisplayName === creatorInfo.displayName &&
                  desc === creatorInfo.description &&
                  !isAddFile &&
                  !isDeleteProfileURL &&
                  !isDeleteBgURL
                }
              />
            </div>
          </div>
          <div className={styled.setUserInfo}>
            <div className={styled.backImage}>
              <div className={styled.image__iconBox}>
                <label htmlFor="attach-bgfile">
                  {editAttachmentBg !== bgImg ? (
                    <div className={styled.image__icon}>
                      {/* 변경 */}
                      <IoCameraReverseOutline />
                    </div>
                  ) : (
                    <div className={styled.image__icon}>
                      {/* 추가 */}
                      <IoCameraOutline />
                    </div>
                  )}
                </label>
                {editAttachmentBg !== bgImg && (
                  <div
                    className={styled.image__icon}
                    onClick={() => onDeleteClick("bg")}
                  >
                    <IoCloseSharp />
                  </div>
                )}
                <input
                  id="attach-bgfile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, "bg")}
                  style={{
                    display: "none",
                  }}
                />
              </div>
              <div className={styled.bgImageBox}>
                <img src={editAttachmentBg} alt="배경화면 이미지" />
              </div>
            </div>
            <div className={styled.editBox}>
              <div className={styled.edit}>
                <div className={styled.profile__image}>
                  <div className={styled.image__iconBox}>
                    <label htmlFor="attach-file">
                      {editAttachment !== noneProfile ? (
                        <div className={styled.image__icon}>
                          {/* 변경 */}
                          <IoCameraReverseOutline />
                        </div>
                      ) : (
                        <div className={styled.image__icon}>
                          {/* 추가 */}
                          <IoCameraOutline />
                        </div>
                      )}
                    </label>
                    {editAttachment !== noneProfile && (
                      <div
                        className={styled.image__icon}
                        onClick={() => onDeleteClick("profile")}
                      >
                        <IoCloseSharp />
                      </div>
                    )}
                    <input
                      id="attach-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileChange(e, "profile")}
                      style={{
                        display: "none",
                      }}
                    />
                  </div>
                  <img src={editAttachment} alt="프로필 이미지" />
                </div>
              </div>
              <div
                className={`${styled.edit} ${
                  select === "name" && styled.select
                } ${creatorInfo.displayName !== "" && styled.focus}`}
              >
                <div className={styled.edit__InputBox}>
                  <p>이름</p>
                  <input
                    maxLength="25"
                    className={styled.edit__Input}
                    ref={inputRef}
                    spellCheck="false"
                    type="text"
                    onFocus={() => setSelect("name")}
                    onBlur={() => setSelect("")}
                    value={newDisplayName}
                    onChange={(e) => {
                      onChangeInfo(e, "displayName");
                    }}
                    required
                  />
                </div>
              </div>
              <div
                className={`${styled.edit} ${
                  select === "desc" && styled.select
                } ${creatorInfo.description !== "" && styled.focus}`}
              >
                <div className={styled.edit__InputBox}>
                  <p>자기 소개</p>
                  <textarea
                    row="3"
                    className={`${styled.edit__Input} ${styled.edit__textarea}`}
                    spellCheck="false"
                    type="text"
                    onFocus={() => setSelect("desc")}
                    onBlur={() => setSelect("")}
                    value={desc}
                    onChange={(e) => {
                      onChangeInfo(e, "description");
                    }}
                    maxLength={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateProfileModal;
