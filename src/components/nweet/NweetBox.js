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
import { useState } from "react";
import UpdateNweetModal from "../modal/UpdateNweetModal";
import { ReplyModal } from "../modal/ReplyModal";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useTimeToString } from "../../hooks/useTimeToString";

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
}) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);
  const etcRef = useRef();
  const [newNweet, setNewNweet] = useState(nweetObj.text); // Modal 취소 후 다시 수정 시 내용 남게
  const [isEditing, setIsEditing] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  // 커스텀 훅
  const { liked, setLiked, toggleLike } = useToggleLike(nweetObj);
  const { bookmark, setBookmark, toggleBookmark } = useToggleBookmark(nweetObj);
  const { nweetEtc, setNweetEtc } = useNweetEctModalClick(etcRef);
  const { timeToString } = useTimeToString();

  useEffect(() => {
    // 좋아요 목록 중 본인 아이디 있으면 true
    const checkLiked = () => {
      const hasCurrentUserLiked = nweetObj?.like?.some(
        (info) => info?.email === currentUser.email
      );
      setLiked(hasCurrentUserLiked);
    };

    // 리트윗된 본인 아이디 있으면 true
    const checkReNweet = () => {
      const hasCurrentUserReNweeted = nweetObj?.reNweet?.some(
        (arr) => arr.email === currentUser.email
      );
      setReNweet(hasCurrentUserReNweeted);
    };

    // 북마크된 본인 아이디 있으면 true
    const checkBookmark = () => {
      const hasCurrentUserBookmarked = currentUser?.bookmark?.includes(
        nweetObj.id
      );
      setBookmark(hasCurrentUserBookmarked);
    };

    checkLiked();
    checkReNweet();
    checkBookmark();
  }, [
    currentUser?.bookmark,
    currentUser.email,
    nweetObj.id,
    nweetObj?.like,
    nweetObj?.reNweet,
    setBookmark,
    setLiked,
    setReNweet,
  ]);

  const toggleNweetEct = () => {
    setNweetEtc((prev) => !prev);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleReplyModal = () => {
    setReplyModal((prev) => !prev);
  };

  const goNweet = (e) => {
    if (pathname.includes("nweet/") && pathname.split("/")[2]) {
      return;
    }
    if (nweetObj?.parent && !etcRef?.current?.contains(e.target)) {
      history.push("/nweet/" + nweetObj.parent);
    } else if (!nweetObj?.parent && !etcRef?.current?.contains(e.target)) {
      history.push("/nweet/" + nweetObj.id);
    }
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
            <div className={styled.nweet__wrapper} onClick={goNweet}>
              <div className={styled.nweet__container}>
                <Link
                  className={styled.nweet__profile}
                  to={`/profile/mynweets/${nweetObj.email}`}
                >
                  <img
                    src={loading && creatorInfo.photoURL}
                    alt="profileImg"
                    loading="lazy"
                    className={styled.profile__image}
                  />
                </Link>
                <div className={styled.userInfo}>
                  <div className={styled.userInfo__name}>
                    <Link
                      className={styled.userInfo__one}
                      to={`/profile/mynweets/${nweetObj.email}`}
                    >
                      <p>{creatorInfo.displayName}</p>
                    </Link>
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
                  <Link
                    className={styled.nweet__replyText}
                    to={`/profile/mynweets/${nweetObj.parentEmail}`}
                  >
                    <p>@{nweetObj.parentEmail?.split("@")[0]}</p>
                    <p>&nbsp;님에게 보내는 답글</p>
                  </Link>
                </div>
              )}
              <div className={styled.nweet__text}>
                <h4>{nweetObj.text}</h4>
              </div>
            </div>
            {nweetObj.attachmentUrl ? (
              <div className={styled.nweet__image} onClick={goNweet}>
                <img
                  src={nweetObj.attachmentUrl}
                  alt="uploaded file"
                  loading="lazy"
                />
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
