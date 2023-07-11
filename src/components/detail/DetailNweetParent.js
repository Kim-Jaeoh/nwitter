import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { dbService } from "../../fbase";
import styled from "./DetailNweetParent.module.css";
import { FiMoreHorizontal, FiRepeat } from "react-icons/fi";
import NweetEtcBtn from "../button/NweetEtcBtn";
import UpdateNweetModal from "../modal/UpdateNweetModal";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { useNweetEctModalClick } from "../../hooks/useNweetEctModalClick";
import { useTimeToString } from "../../hooks/useTimeToString";
import { useToggleLike } from "../../hooks/useToggleLike";
import { useToggleBookmark } from "../../hooks/useToggleBookmark";
import { ReplyModal } from "../modal/ReplyModal";
import { useDispatch, useSelector } from "react-redux";
import { setNotModal } from "../../reducer/user";
import { useToggleRepliesRenweet } from "../../hooks/useToggleRepliesRenweet";
import { Link } from "react-router-dom";

const DetailNweetParent = ({ nweetObj, userObj, reNweetsObj }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const etcRef = useRef();
  const [newNweet, setNewNweet] = useState(nweetObj?.text);
  const [creatorInfo, setCreatorInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyModal, setReplyModal] = useState(false);

  //  map 처리 된 각 유저 정보들
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", nweetObj.email),
      (doc) => {
        setCreatorInfo(doc.data());
        setLoading(true);
      }
    );

    return () => unsubscribe();
  }, [nweetObj]);

  const { reNweet, setReNweet, toggleReNweet } = useToggleRepliesRenweet(
    reNweetsObj,
    nweetObj,
    userObj
  );
  const { liked, setLiked, toggleLike } = useToggleLike(nweetObj);
  const { bookmark, setBookmark, toggleBookmark } = useToggleBookmark(nweetObj);
  const { nweetEtc, setNweetEtc } = useNweetEctModalClick(etcRef);

  const { timeToString2 } = useTimeToString();

  useEffect(() => {
    // 좋아요 목록 중 본인 아이디 있으면 true
    const checkLiked = () => {
      const hasCurrentUserLiked = nweetObj?.like?.includes(currentUser.email);
      setLiked(hasCurrentUserLiked);
    };

    // 리트윗된 본인 아이디 있으면 true
    const checkReNweet = () => {
      const hasCurrentUserReNweeted = nweetObj?.reNweet?.some(
        (arr) => arr.email === userObj.email
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
  }, [nweetObj, currentUser, userObj, setLiked, setReNweet, setBookmark]);

  const toggleNweetEct = () => {
    setNweetEtc((prev) => !prev);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleReplyModal = () => {
    setReplyModal((prev) => !prev);
    dispatch(setNotModal({ modal: false }));
  };

  return (
    <>
      {loading && (
        <>
          <div className={styled.nweet}>
            {reNweet && (
              <div className={styled.nweet__reNweet}>
                <div className={styled.nweet__reNweetIcon}>
                  <FiRepeat />
                </div>
                <p>{currentUser.displayName} 님이 리트윗 했습니다</p>
              </div>
            )}
            <div className={styled.nweet__wrapper}>
              <div className={styled.nweet__container}>
                <Link
                  to={`/profile/mynweets/${nweetObj?.email}`}
                  className={styled.nweet__profile}
                >
                  <img
                    src={creatorInfo.photoURL}
                    alt="profileImg"
                    className={styled.profile__image}
                  />
                </Link>
                <div className={styled.userInfo}>
                  <div className={styled.userInfo__name}>
                    <Link
                      to={`/profile/mynweets/${nweetObj?.email}`}
                      className={styled.userInfo__one}
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
                    </div>
                  </div>
                  {userObj.email === nweetObj.email && (
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
                          toggleEdit={toggleEdit}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className={styled.nweet__text}>
                <h4>{nweetObj.text}</h4>
              </div>
              <div className={styled.nweet__created}>
                <p className={styled.nweet__createdAt}>
                  {timeToString2(nweetObj.createdAt)}
                </p>
              </div>
            </div>
            {nweetObj.attachmentUrl ? (
              <div className={styled.nweet__image}>
                <img src={nweetObj.attachmentUrl} alt="uploaded file" />
              </div>
            ) : null}
            <nav className={styled.nweet__actions}>
              {(nweetObj.replyId.length ||
                nweetObj.reNweet.length ||
                nweetObj.like.length) !== 0 && (
                <div className={styled.actions__text}>
                  <div className={styled.comment__text}>
                    {nweetObj.replyId?.length === 0 ? (
                      ""
                    ) : (
                      <>
                        <span>{nweetObj.replyId?.length}</span>
                        <span> 답글</span>
                      </>
                    )}
                  </div>
                  <div className={styled.reNweet__text}>
                    {nweetObj.reNweet?.length === 0 ? (
                      ""
                    ) : (
                      <>
                        <span>{nweetObj.reNweet?.length}</span>
                        <span> 리트윗</span>
                      </>
                    )}
                  </div>
                  <div className={styled.like__text}>
                    {nweetObj.like?.length === 0 ? (
                      ""
                    ) : (
                      <>
                        <span>{nweetObj.like?.length}</span>
                        <span> 마음에 들어요</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className={styled.actionBox}>
                <div className={styled.comment}>
                  <div
                    className={styled.actions__icon}
                    onClick={toggleReplyModal}
                  >
                    <FaRegComment />
                  </div>
                </div>
                <div
                  className={`${styled.reNweetBox} ${
                    reNweet && styled.reNweet
                  }`}
                >
                  <div className={styled.actions__icon} onClick={toggleReNweet}>
                    <FiRepeat />
                  </div>
                </div>
                <div className={`${styled.likeBox} ${liked && styled.like}`}>
                  <div className={styled.actions__icon} onClick={toggleLike}>
                    {liked ? <FaHeart /> : <FaRegHeart />}
                  </div>
                </div>
                <div
                  className={`${styled.bookmarkBox} ${
                    bookmark && styled.bookmark
                  }`}
                >
                  <div
                    className={styled.actions__icon}
                    onClick={toggleBookmark}
                  >
                    {bookmark ? <FaBookmark /> : <FaRegBookmark />}
                  </div>
                </div>
              </div>
            </nav>
          </div>
          {userObj.email === nweetObj.email && isEditing && (
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
      )}
    </>
  );
};

export default DetailNweetParent;
