import React, { useEffect, useRef } from "react";
import styled from "./Nweet.module.css";
import { FiMoreHorizontal, FiRepeat } from "react-icons/fi";
import NweetEtcBtn from "../button/NweetEtcBtn";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useToggleLike } from "../../hooks/useToggleLike";
import { useToggleBookmark } from "../../hooks/useToggleBookmark";
import { useNweetEctModalClick } from "../../hooks/useNweetEctModalClick";
import { useGoPage } from "../../hooks/useGoPage";
import { useState } from "react";
import UpdateNweetModal from "../modal/UpdateNweetModal";
import { ReplyModal } from "../modal/ReplyModal";

export const NweetBox = ({
  loading,
  userObj,
  nweetObj,
  creatorInfo,
  reNweetsObj,
  reNweet,
  setReNweet,
  toggleReNweet,
  isOwner,
  timeToString,
}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const etcRef = useRef();
  const nameRef = useRef();
  const imgRef = useRef();
  const replyRef = useRef();
  const [newNweet, setNewNweet] = useState(nweetObj.text); // Modal 취소 후 다시 수정 시 내용 남게
  const [isEditing, setIsEditing] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [replyModal, setReplyModal] = useState(false);

  const toggleReplyModal = () => {
    setReplyModal((prev) => !prev);
  };

  // 커스텀 훅
  const { liked, setLiked, toggleLike } = useToggleLike(nweetObj);
  const { bookmark, setBookmark, toggleBookmark } = useToggleBookmark(nweetObj);
  const { nweetEtc, setNweetEtc } = useNweetEctModalClick(etcRef);

  const { goNweet, goProfile } = useGoPage(
    nweetObj,
    etcRef,
    imgRef,
    nameRef,
    replyRef
  );

  // 좋아요 목록 중 본인 아이디 있으면 true
  useEffect(() => {
    if (nweetObj?.like?.includes(currentUser.email)) {
      setLiked(nweetObj?.like?.includes(currentUser.email));
    }
  }, [nweetObj?.like, setLiked, currentUser.email]);

  // 리트윗된 본인 아이디 있으면 true
  useEffect(() => {
    setReNweet(nweetObj?.reNweet?.includes(userObj.email));
  }, [userObj.email, nweetObj?.reNweet, setReNweet]);

  // 북마크된 본인 아이디 있으면 true
  useEffect(() => {
    setBookmark(currentUser?.bookmark?.includes(nweetObj.id));
  }, [currentUser?.bookmark, nweetObj.id, setBookmark]);

  const toggleNweetEct = () => {
    setNweetEtc((prev) => !prev);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      {loading && (
        <>
          <li className={styled.nweet}>
            {reNweet && (
              <div className={styled.nweet__reNweet}>
                <div className={styled.nweet__reNweetIcon}>
                  <FiRepeat />
                </div>
                <p>{currentUser.displayName} 님이 리트윗 했습니다</p>
              </div>
            )}
            <div className={styled.nweet__wrapper} onClick={(e) => goNweet(e)}>
              <div className={styled.nweet__container}>
                <div
                  className={styled.nweet__profile}
                  ref={imgRef}
                  onClick={(e) => goProfile(e)}
                >
                  <img
                    src={loading && creatorInfo.photoURL}
                    alt="profileImg"
                    className={styled.profile__image}
                  />
                </div>
                <div className={styled.userInfo}>
                  <div className={styled.userInfo__name}>
                    <div
                      className={styled.userInfo__one}
                      ref={nameRef}
                      onClick={(e) => goProfile(e)}
                    >
                      <p>{creatorInfo.displayName}</p>
                    </div>
                    <div className={styled.userInfo__two}>
                      <p>
                        @
                        {creatorInfo.email
                          ? creatorInfo.email.split("@")[0]
                          : ""}
                      </p>
                      <p style={{ margin: "0 4px" }}>·</p>
                      <p className={styled.nweet__createdAt}>
                        {timeToString(nweetObj.createdAt)}
                      </p>
                    </div>
                  </div>
                  {nweetObj.creatorId === userObj.uid && (
                    <div className={styled.nweet__edit} ref={etcRef}>
                      <div
                        className={styled.nweet__editIcon}
                        onClick={toggleNweetEct}
                      >
                        <FiMoreHorizontal />
                        <div className={styled.horizontal__bg}></div>
                      </div>
                      {nweetEtc && (
                        <NweetEtcBtn
                          nweetAttachment={nweetObj.attachmentUrl}
                          nweetObj={nweetObj}
                          setNweetEtc={setNweetEtc}
                          toggleEdit={toggleEdit}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {nweetObj.parent && (
                <div className={`${styled.nweet__reply} ${styled.select}`}>
                  <div
                    className={styled.nweet__replyText}
                    ref={replyRef}
                    onClick={(e) => goProfile(e)}
                  >
                    <p>@{nweetObj.parentEmail?.split("@")[0]}</p>
                    <p>&nbsp;님에게 보내는 답글</p>
                  </div>
                </div>
              )}
              <div className={styled.nweet__text}>
                <h4>{nweetObj.text}</h4>
              </div>
            </div>
            {nweetObj.attachmentUrl ? (
              <div className={styled.nweet__image}>
                <img src={nweetObj.attachmentUrl} alt="uploaded file" />
              </div>
            ) : null}
            <nav className={styled.nweet__actions}>
              <div className={`${styled.actionBox} ${styled.comment}`}>
                <div
                  className={styled.actions__icon}
                  onClick={toggleReplyModal}
                >
                  <FaRegComment />
                </div>
                <div className={styled.actions__text}>
                  <p>
                    {nweetObj.replyId?.length === 0
                      ? ""
                      : nweetObj.replyId?.length}
                  </p>
                </div>
              </div>
              <div
                className={`${styled.actionBox} ${reNweet && styled.reNweet}`}
              >
                <div className={styled.actions__icon} onClick={toggleReNweet}>
                  <FiRepeat />
                </div>
                <div className={styled.actions__text}>
                  <p>
                    {nweetObj.reNweet.length === 0
                      ? ""
                      : nweetObj.reNweet.length}
                  </p>
                </div>
              </div>
              <div className={`${styled.actionBox} ${liked && styled.like}`}>
                <div className={styled.actions__icon} onClick={toggleLike}>
                  {liked ? <FaHeart /> : <FaRegHeart />}
                </div>
                <div className={styled.actions__text}>
                  <p>
                    {nweetObj.like.length === 0 ? "" : nweetObj.like.length}
                  </p>
                </div>
              </div>
              <div
                className={`${styled.actionBox} ${bookmark && styled.bookmark}`}
              >
                <div className={styled.actions__icon} onClick={toggleBookmark}>
                  {bookmark ? <FaBookmark /> : <FaRegBookmark />}
                </div>
              </div>
            </nav>
          </li>
        </>
      )}
      {isOwner && isEditing && (
        <UpdateNweetModal
          userObj={userObj}
          creatorInfo={creatorInfo}
          reNweetsObj={reNweetsObj}
          nweetObj={nweetObj}
          newNweet={newNweet}
          setNewNweet={setNewNweet}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          nweetAttachment={nweetObj.attachmentUrl}
        />
      )}
      {replyModal && (
        <ReplyModal
          replyModal={replyModal}
          setReplyModal={setReplyModal}
          creatorInfo={creatorInfo}
          nweetObj={nweetObj}
          userObj={userObj}
          loading={loading}
          toggleReplyModal={toggleReplyModal}
        />
      )}
    </>
  );
};
