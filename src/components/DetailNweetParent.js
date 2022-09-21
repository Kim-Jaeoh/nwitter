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
import styled from "./DetailNweetParent.module.css";
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

const DetailNweetParent = ({ nweetObj, userObj, reNweetsObj }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.user.currentUser);
  const etcRef = useRef();
  const imgRef = useRef();
  const nameRef = useRef();
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [newNweetAttachment, setNewNweetAttachment] = useState(
    nweetObj.attachmentUrl
  );

  const [filterReNweetId, setFilterReNweetId] = useState({});

  const [creatorInfo, setCreatorInfo] = useState({});
  const [nweetEtc, setNweetEtc] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [reNweet, setReNweet] = useState(false);
  const [reNweetsId, setReNweetsId] = useState([]);
  const [isAreaHeight, setIsAreaHeight] = useState(""); // Modal에서 textArea 높이값 저장받음
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   reNweetsObj.forEach((asd) => {
  //     if (asd.parent === nweetObj.id) {
  //       setFilterReNweetId(asd.id);
  //     }
  //   });
  //   console.log(filterReNweetId);
  // }, [filterReNweetId, reNweetsObj, userObj.email]);

  // useEffect(() => {
  //   return () => setLoading(false);
  // }, []);

  //  map 처리 된 각 유저 정보들
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
    setLiked(nweetObj.like?.includes(currentUser.email));
  }, [nweetObj.like, currentUser.email]);

  // 북마크된 본인 아이디 있으면 true
  useEffect(() => {
    setBookmark(currentUser?.bookmark?.includes(nweetObj.id));
  }, [currentUser.bookmark, nweetObj.id]);

  // 리트윗된 본인 아이디 있으면 true
  useEffect(() => {
    setReNweet(nweetObj.reNweet?.includes(currentUser.email));
  }, [currentUser.email, nweetObj.reNweet]);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  // 수정된 글 firebase에 업데이트
  useEffect(() => {
    const index = reNweetsObj?.findIndex((obj) => obj.parent === nweetObj.id);
    setFilterReNweetId(reNweetsObj[index]);
  }, [nweetObj.id, nweetObj.replyId, reNweetsObj]);

  const onSubmit = async (e) => {
    const dbRef = doc(dbService, "nweets", nweetObj.id);
    const reNweetRef = doc(dbService, "reNweets", filterReNweetId.id);

    alert("업데이트 되었습니다");
    e.preventDefault();

    await updateDoc(dbRef, {
      text: newNweet,
      attachmentUrl: nweetObj.attachmentUrl,
    });

    await updateDoc(reNweetRef, {
      parentText: newNweet,
    });

    setIsEditing(false);
  };

  const timeToString = (timestamp) => {
    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let amPm = "오전";

    if (hours >= 12) {
      amPm = "오후";
      hours = hours - 12;
    }

    let timeString = amPm + " " + hours + ":" + minutes;

    let str =
      // (date.getHours() >= 12 ? "오후 " : "오전 ") +
      timeString +
      " · " +
      date.getFullYear() +
      "년 " +
      Number(date.getMonth() + 1) +
      "월 " +
      date.getDate() +
      "일 ";
    return str;
  };

  const toggleNweetEct = useCallback(() => {
    setNweetEtc((prev) => !prev);
  }, []);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleLike = async () => {
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
      const copy = [...reNweetsObj];
      const index = copy?.findIndex((obj) => {
        return obj?.parent === nweetObj.id;
      });
      setReNweetsId(copy[index]);
    } else {
      return;
    }
  }, [nweetObj.id, reNweetsObj]);

  const toggleReNweet = async () => {
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
  };

  const goPage = (e, type) => {
    if (
      imgRef.current.contains(e.target) ||
      nameRef.current.contains(e.target)
    ) {
      history.push("/profile/mynweets/" + nweetObj.email);
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
            <div className={styled.nweet__wrapper}>
              <div
                className={styled.nweet__container}
                onClick={(e) => goPage(e)}
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
                  {timeToString(nweetObj.createdAt)}
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
                  <div className={styled.actions__icon}>
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

export default DetailNweetParent;
