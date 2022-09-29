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
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useNweetEctModalClick } from "../../hooks/useNweetEctModalClick";
import { useTimeToString } from "../../hooks/useTimeToString";
import { useToggleReNweet } from "../../hooks/useToggleReNweet";
import { useToggleLike } from "../../hooks/useToggleLike";
import { useToggleBookmark } from "../../hooks/useToggleBookmark";
import { useGoPage } from "../../hooks/useGoPage";
import { ReplyModal } from "../modal/ReplyModal";

const DetailNweetParent = ({ nweetObj, userObj, reNweetsObj }) => {
  const history = useHistory();
  const currentUser = useSelector((state) => state.user.currentUser);
  const etcRef = useRef();
  const imgRef = useRef();
  const nameRef = useRef();
  const [newNweet, setNewNweet] = useState(nweetObj?.text);
  const [creatorInfo, setCreatorInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyModal, setReplyModal] = useState(false);

  const toggleReplyModal = () => {
    setReplyModal((prev) => !prev);
  };

  //  map 처리 된 각 유저 정보들
  useEffect(() => {
    onSnapshot(doc(dbService, "users", nweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [nweetObj]);

  const { reNweet, setReNweet, toggleReNweet } = useToggleReNweet(
    reNweetsObj,
    nweetObj,
    userObj
  );
  const { liked, setLiked, toggleLike } = useToggleLike(nweetObj);
  const { bookmark, setBookmark, toggleBookmark } = useToggleBookmark(nweetObj);
  const { nweetEtc, setNweetEtc } = useNweetEctModalClick(etcRef);

  const { timeToString2 } = useTimeToString();

  // 좋아요 목록 중 본인 아이디 있으면 true
  useEffect(() => {
    setLiked(nweetObj.like?.includes(currentUser.email));
  }, [nweetObj.like, currentUser.email, setLiked]);

  // 북마크된 본인 아이디 있으면 true
  useEffect(() => {
    setBookmark(currentUser?.bookmark?.includes(nweetObj.id));
  }, [currentUser?.bookmark, nweetObj.id, setBookmark]);

  // 리트윗된 본인 아이디 있으면 true
  useEffect(() => {
    setReNweet(nweetObj.reNweet?.includes(currentUser.email));
  }, [currentUser.email, nweetObj.reNweet, setReNweet]);

  const toggleNweetEct = () => {
    setNweetEtc((prev) => !prev);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const { goParent } = useGoPage(nweetObj, etcRef, imgRef, nameRef, "");

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
              <div
                className={styled.nweet__container}
                onClick={(e) => goParent(e)}
              >
                <div className={styled.nweet__profile} ref={imgRef}>
                  <img
                    src={loading && creatorInfo.photoURL}
                    alt="profileImg"
                    className={styled.profile__image}
                  />
                </div>
                <div className={styled.userInfo}>
                  <div className={styled.userInfo__name}>
                    <div className={styled.userInfo__one} ref={nameRef}>
                      <p>{creatorInfo.displayName}</p>
                    </div>
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
