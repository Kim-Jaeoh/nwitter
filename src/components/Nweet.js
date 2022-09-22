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
import { useHistory } from "react-router-dom";

const Nweet = ({ nweetObj, isOwner, userObj, reNweetsObj }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.user.currentUser);
  const etcRef = useRef();
  const nameRef = useRef();
  const imgRef = useRef();

  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [filterReNweetId, setFilterReNweetId] = useState({});
  const [creatorInfo, setCreatorInfo] = useState({});
  const [nweetEtc, setNweetEtc] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [reNweetsId, setReNweetsId] = useState({});
  const [reNweet, setReNweet] = useState(false);
  const [isAreaHeight, setIsAreaHeight] = useState(""); // Modal에서 textArea 높이값 저장받음
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(Date.now());

  // useEffect(() => {
  //   return () => setLoading(false);
  // }, []);

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

  // 수정된 글 firebase에 업데이트
  useEffect(() => {
    // 답글
    const index = reNweetsObj?.findIndex((obj) => obj.replyId === nweetObj.id);
    setFilterReNweetId(reNweetsObj[index]);

    // // 원글
    // const index2 = reNweetsObj?.findIndex(
    //   (obj) => obj?.parentEmail === userObj.email
    // );
    // setFilterRepliesReNweetId(reNweetsObj[index2]);
  }, [nweetObj.id, reNweetsObj, userObj.email]);

  const onSubmit = async (e) => {
    alert("업데이트 되었습니다");
    e.preventDefault();

    if (nweetObj?.parent) {
      // 답글 업뎃
      const repliesRef = doc(dbService, "replies", nweetObj.id);
      await updateDoc(repliesRef, {
        text: newNweet,
        attachmentUrl: nweetObj.attachmentUrl,
      });
    } else {
      // 원글 업뎃
      const nweetsRef = doc(dbService, "nweets", nweetObj.id);
      await updateDoc(nweetsRef, {
        text: newNweet,
        attachmentUrl: nweetObj.attachmentUrl,
      });
    }

    if (filterReNweetId) {
      const reNweetRef = doc(dbService, "reNweets", filterReNweetId.id);
      await updateDoc(reNweetRef, {
        text: newNweet,
      });
    }

    setIsEditing(false);
  };

  // 수정된 글 firebase에 업데이트
  // useEffect(() => {
  //   const index = reNweetsObj?.findIndex((obj) => obj.parent === nweetObj.id);
  //   setFilterReNweetId(reNweetsObj[index]);
  // }, [nweetObj.id, nweetObj.replyId, reNweetsObj]);

  // const onSubmit = async (e) => {
  //   const dbRef = doc(dbService, "nweets", nweetObj.id);

  //   alert("업데이트 되었습니다");
  //   e.preventDefault();

  //   await updateDoc(dbRef, {
  //     text: newNweet,
  //     attachmentUrl: nweetObj.attachmentUrl,
  //   });

  //   // if (filterReNweetId) {
  //   //   const reNweetRef = doc(dbService, "reNweets", filterReNweetId.id);
  //   //   await updateDoc(reNweetRef, {
  //   //     parentText: newNweet,
  //   //   });
  //   // }

  //   setIsEditing(false);
  // };

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

  const toggleNweetEct = () => {
    setNweetEtc((prev) => !prev);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleLike = async () => {
    if (nweetObj.like?.includes(currentUser.email)) {
      setLiked(false);
      const copy = [...nweetObj.like];
      const filter = copy.filter((email) => email !== currentUser.email);

      if (Object.keys(nweetObj).includes("parent") === false) {
        await updateDoc(doc(dbService, "nweets", nweetObj.id), {
          like: filter,
        });
      } else {
        await updateDoc(doc(dbService, "replies", nweetObj.id), {
          like: filter,
        });
      }
    } else {
      setLiked(true);
      const copy = [...nweetObj.like];
      copy.push(currentUser.email);

      if (Object.keys(nweetObj).includes("parent") === false) {
        await updateDoc(doc(dbService, "nweets", nweetObj.id), {
          like: copy,
        });
      } else {
        await updateDoc(doc(dbService, "replies", nweetObj.id), {
          like: copy,
        });
      }
    }
  };

  const toggleBookmark = async () => {
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
  };

  useEffect(() => {
    if (reNweetsObj) {
      const filter = reNweetsObj.filter((asd) => asd.parent === nweetObj.id);
      const index = filter.findIndex((obj) => obj?.email === userObj.email);

      setReNweetsId(filter[index]);
    } else {
      return;
    }
  }, [nweetObj.id, reNweetsObj, userObj.email]);

  const toggleReNweet = async () => {
    if (nweetObj.reNweet?.includes(userObj.email)) {
      setReNweet(false);
      const copy = [...nweetObj.reNweet];
      const filter = copy.filter((email) => {
        return email !== userObj.email;
      });

      await updateDoc(doc(dbService, "nweets", nweetObj.id), {
        reNweet: filter,
      });

      const reNweetsRef = doc(dbService, "reNweets", reNweetsId.id);
      await deleteDoc(reNweetsRef); // 원글의 reply 삭제

      dispatch(
        setCurrentUser({
          ...currentUser,
          reNweet: filter,
        })
      );
    } else {
      setReNweet(true);
      const _nweetReply = {
        parentText: nweetObj.text,
        creatorId: userObj.uid,
        email: userObj.email,
        like: [],
        // reNweet: [],
        reNweetAt: time,
        parent: nweetObj.id || null,
        parentEmail: nweetObj.email || null,
      };
      await addDoc(collection(dbService, "reNweets"), _nweetReply);

      const copy = [...nweetObj.reNweet, userObj.email];

      await updateDoc(doc(dbService, "nweets", nweetObj.id), {
        reNweet: copy,
      });

      dispatch(
        setCurrentUser({
          ...currentUser,
          reNweet: copy,
        })
      );
    }
  };

  const goPage = (e) => {
    if (
      imgRef.current.contains(e.target) ||
      nameRef.current.contains(e.target)
    ) {
      if (nweetObj.email !== userObj.email) {
        history.push("/user/mynweets/" + nweetObj.email);
      } else {
        history.push("/profile/mynweets/" + nweetObj.email);
      }
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
                          nweetAttachment={nweetObj.attachmentUrl}
                          nweetObj={nweetObj}
                          toggleEdit={toggleEdit}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {nweetObj.parent && (
                <div className={`${styled.nweet__reply} ${styled.select}`}>
                  <div className={styled.nweet__replyText} ref={nameRef}>
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
                <div className={styled.actions__icon}>
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
          </div>
          {isOwner && isEditing && (
            <UpdateNweetModal
              creatorInfo={creatorInfo}
              setNewNweet={setNewNweet}
              onChange={onChange}
              onSubmit={onSubmit}
              newNweet={newNweet}
              nweetAttachment={nweetObj.attachmentUrl}
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
