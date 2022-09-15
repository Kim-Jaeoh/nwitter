import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { dbService } from "../fbase";
import styled from "./Nweet.module.css";
import { FiMoreHorizontal, FiRepeat } from "react-icons/fi";
import NweetEtcBtn from "./NweetEtcBtn";
import UpdateNweetModal from "./UpdateNweetModal";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer/user";
import { Link, useHistory } from "react-router-dom";

const Nweet = ({ nweetObj, isOwner, userObj, reNweetsObj }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.user.currentUser);
  const etcRef = useRef();
  const nameRef = useRef();
  const imgRef = useRef();
  const dbRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [newNweetAttachment, setNewNweetAttachment] = useState(
    nweetObj.attachmentUrl
  );
  const [creatorInfo, setCreatorInfo] = useState({});
  const [nweetEtc, setNweetEtc] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [reNweetsId, setReNweetsId] = useState([]);
  const [reNweet, setReNweet] = useState(false);
  const [isAreaHeight, setIsAreaHeight] = useState(""); // Modal에서 textArea 높이값 저장받음
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [time, setTime] = useState(Date.now());

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  //  map 처리 된 유저 정보들
  useEffect(() => {
    onSnapshot(doc(dbService, "users", nweetObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [nweetObj]);

  useEffect(() => {
    // nweetEct가 true면 return;으로 인해 함수 종료(렌더 후 클릭 시 에러 방지)
    if (!nweetEtc) return;

    const handleClick = (e) => {
      if (!etcRef.current.contains(e.target)) {
        setNweetEtc(false);
      } else if (etcRef.current === null) {
        return;
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [nweetEtc]);

  // 좋아요 목록 중 본인 아이디 있으면 true
  useEffect(() => {
    setLiked(nweetObj?.like?.includes(userObj.email));
  }, [nweetObj.like, userObj.email]);

  // 북마크된 본인 아이디 있으면 true
  useEffect(() => {
    setBookmark(currentUser?.bookmark?.includes(nweetObj.id));
  }, [currentUser.bookmark, nweetObj.id]);

  // 리트윗된 본인 아이디 있으면 true
  useEffect(() => {
    setReNweet(nweetObj?.reNweet?.includes(userObj.email));
  }, [userObj.email, nweetObj.reNweet]);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  const onSubmit = async (e) => {
    alert("업데이트 되었습니다");
    e.preventDefault();
    await updateDoc(dbRef, {
      text: newNweet,
      attachmentUrl: newNweetAttachment,
    });
    setIsEditing(false);
  };

  const timeToString = (timestamp) => {
    const today = new Date();
    const timeValue = new Date(timestamp);

    const betweenTime = Math.floor(
      (today.getTime() - timeValue.getTime()) / 1000 / 60
    );
    if (betweenTime < 1) return "방금 전";
    if (betweenTime < 60) {
      return `${betweenTime}분 전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간 전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일 전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년 전`;
  };

  const toggleNweetEct = useCallback(() => {
    setNweetEtc((prev) => !prev);
  }, []);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleLike = useCallback(async () => {
    if (nweetObj.like?.includes(currentUser.email)) {
      setLiked(false);
      const copy = [...nweetObj.like];
      const filter = copy.filter((email) => email !== currentUser.email);
      await updateDoc(doc(dbService, "nweets", nweetObj.id), {
        like: filter,
      });
    } else {
      setLiked(true);
      const copy = [...nweetObj.like];
      copy.push(currentUser.email);
      await updateDoc(doc(dbService, "nweets", nweetObj.id), {
        like: copy,
      });
    }
  }, [currentUser.email, nweetObj.id, nweetObj.like]);

  const toggleBookmark = useCallback(async () => {
    if (currentUser.bookmark?.includes(nweetObj.id)) {
      setBookmark(false);
      const copy = [...currentUser.bookmark];
      const filter = copy.filter((id) => id !== nweetObj.id);
      await updateDoc(doc(dbService, "users", currentUser.email), {
        bookmark: filter,
      });
      dispatch(
        setCurrentUser({
          ...currentUser,
          bookmark: filter,
        })
      );
    } else {
      setBookmark(true);
      const copy = [...currentUser.bookmark];
      copy.push(nweetObj.id);
      await updateDoc(doc(dbService, "users", currentUser.email), {
        bookmark: copy,
      });
      dispatch(
        setCurrentUser({
          ...currentUser,
          bookmark: copy,
        })
      );
    }
  }, [currentUser, dispatch, nweetObj.id]);

  useEffect(() => {
    if (reNweetsObj) {
      const copy = [...reNweetsObj];
      const index = copy?.findIndex((obj) => {
        return obj?.parent === nweetObj.id;
      });
      setReNweetsId(copy[index]);
    } else {
      return;
    }
  }, [nweetObj.id, reNweetsObj]);

  const toggleReNweet = useCallback(async () => {
    if (nweetObj.reNweet?.includes(userObj.email)) {
      setReNweet(false);
      const copy = [...nweetObj.reNweet];
      const copy2 = [...nweetObj.reNweetAt];
      const filter = copy.filter((email) => email !== userObj.email);
      const filter2 = copy2.filter(
        (time) => !nweetObj.reNweetAt.includes(time)
      );
      await updateDoc(doc(dbService, "nweets", nweetObj.id), {
        reNweet: filter,
        reNweetAt: filter2,
      });

      const reNweetsRef = doc(dbService, "reNweets", reNweetsId.id);
      await deleteDoc(reNweetsRef); // 원글의 reply 삭제
      dispatch(
        setCurrentUser({
          ...currentUser,
          reNweet: filter,
          reNweetAt: filter2,
        })
      );
    } else {
      setReNweet(true);
      const _nweetReply = {
        text: nweetObj.text,
        creatorId: userObj.uid,
        email: userObj.email,
        like: [],
        // reNweet: [],
        reNweetAt: Date.now(),
        parent: nweetObj.id,
        parentEmail: nweetObj.email,
      };
      await addDoc(collection(dbService, "reNweets"), _nweetReply);

      const copy = [...nweetObj.reNweet, userObj.email];
      const copy2 = [...nweetObj.reNweetAt, _nweetReply.reNweetAt];
      await updateDoc(doc(dbService, "nweets", nweetObj.id), {
        reNweet: copy,
        reNweetAt: copy2,
      });

      dispatch(
        setCurrentUser({
          ...currentUser,
          reNweet: copy,
          reNweetAt: copy2,
        })
      );
    }
  }, [
    currentUser,
    dispatch,
    nweetObj.email,
    nweetObj.id,
    nweetObj.reNweet,
    nweetObj.reNweetAt,
    nweetObj.text,
    reNweetsId?.id,
    userObj.email,
    userObj.uid,
  ]);

  const goPage = (e) => {
    if (
      imgRef.current.contains(e.target) ||
      nameRef.current.contains(e.target)
    ) {
      history.push("/profile/mynweets/" + nweetObj.email);
    } else if (
      !imgRef.current.contains(e.target) &&
      !nameRef.current.contains(e.target) &&
      !etcRef?.current?.contains(e.target)
    ) {
      history.push("/nweet/" + nweetObj.id);
    }
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
            <div className={styled.nweet__wrapper} onClick={(e) => goPage(e)}>
              <div className={styled.nweet__container}>
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
                      <p style={{ margin: "0 4px" }}>·</p>
                      <p className={styled.nweet__createdAt}>
                        {timeToString(nweetObj.createdAt)}
                      </p>
                    </div>
                  </div>
                  {isOwner && (
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
                          newNweetAttachment={newNweetAttachment}
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
            </div>
            {nweetObj.attachmentUrl ? (
              <div className={styled.nweet__image}>
                <img src={nweetObj.attachmentUrl} alt="uploaded file" />
              </div>
            ) : null}
            <nav className={styled.nweet__actions}>
              <div className={`${styled.actionBox} ${styled.comment}`}>
                <div className={styled.actions__icon}>
                  <FaRegComment />
                </div>
                <div className={styled.actions__text}>
                  <p>
                    {nweetObj.reply?.length === 0 ? "" : nweetObj.reply?.length}
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
          </div>
          {isOwner && isEditing && (
            <UpdateNweetModal
              creatorInfo={creatorInfo}
              setNewNweet={setNewNweet}
              onChange={onChange}
              onSubmit={onSubmit}
              newNweet={newNweet}
              newNweetAttachment={newNweetAttachment}
              setNewNweetAttachment={setNewNweetAttachment}
              isEditing={isEditing}
              toggleEdit={toggleEdit}
              isAreaHeight={isAreaHeight}
              setIsAreaHeight={setIsAreaHeight}
            />
          )}
        </>
      )}
    </>
  );
};

export default Nweet;
