import React, { useEffect, useState } from "react";
import styled from "./Profile.module.css";
import { doc, onSnapshot } from "firebase/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { authService, dbService } from "../fbase";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLoginToken } from "../reducer/user";
import { IoArrowBackOutline } from "react-icons/io5";
import { BsCalendar3 } from "react-icons/bs";
import Bookmark from "./Bookmark";
import UpdateProfileModal from "../components/modal/UpdateProfileModal";
import MyNweets from "../components/profile/ProfileMyNweets";
import { Replies } from "../components/profile/ProfileReplies";
import SelectMenuBtn from "../components/button/SelectMenuBtn";
import { IoMdExit } from "react-icons/io";
import { TopCategory } from "../components/topCategory/TopCategory";
import { useToggleFollow } from "../hooks/useToggleFollow";
import { useTimeToString } from "../hooks/useTimeToString";
import CircleLoader from "../components/loader/CircleLoader";
import ProfileLikeBox from "../components/profile/ProfileLikeBox";
import ProfileReNweetBox from "../components/profile/ProfileReNweetBox";

const Profile = ({ userObj }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const uid = location.pathname.split("/")[3];
  const uid2 = location.pathname.split("/").slice(0, 3).join("/");
  const [creatorInfo, setCreatorInfo] = useState({});
  const [myInfo, setMyInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [myNweets, setMyNweets] = useState([]);
  const [selected, setSelected] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [size, setSize] = useState(window.innerWidth);
  const [resize, setResize] = useState(false);

  // 커스텀 훅
  const { timeToString3 } = useTimeToString();
  const toggleFollow = useToggleFollow(myInfo);

  useEffect(() => {
    if (location.pathname.includes("/mynweets")) {
      setSelected(1);
    } else if (location.pathname.includes("/replies")) {
      setSelected(2);
    } else if (location.pathname.includes("/renweets")) {
      setSelected(3);
    } else if (location.pathname.includes("/like")) {
      setSelected(4);
    } else if (location.pathname.includes("/bookmark")) {
      setSelected(5);
    }
  }, [location.pathname, userObj.email]);

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setMyInfo(doc.data());
    });
  }, [userObj.email]);

  // 필터링 방법 (본인이 작성한 것 확인)
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("email", "==", uid),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (querySnapshot) => {
      const array = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyNweets(array);
    });
  }, [uid]);

  // 렌더링 시 실시간 정보 가져오고 이메일, 닉네임, 사진 바뀔 때마다 리렌더링(업데이트)
  useEffect(() => {
    onSnapshot(doc(dbService, "users", uid), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [uid]);

  // 리사이징
  useEffect(() => {
    // 렌더 시
    if (size < 500) {
      setResize(true);
    } else if (size > 500) {
      setResize(false);
    }
    const Resize = () => {
      let innerSize = window.innerWidth;
      setSize(innerSize);
    };
    window.addEventListener("resize", Resize);
    return () => window.addEventListener("resize", Resize);
  }, [history, size]);

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃 하시겠어요?");
    if (ok) {
      authService.signOut();
      dispatch(setLoginToken("logout"));
      dispatch(
        setCurrentUser({
          photoURL: "",
          uid: "",
          displayName: "",
          email: "",
          description: "",
          bgURL: "",
          bookmark: [],
          follower: [],
          following: [],
          reNweet: [],
          reNweetAt: [],
        })
      );
      history.push("/auth");
    }
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      <section className={styled.container}>
        <div className={styled.main__container}>
          <TopCategory
            text={creatorInfo.displayName}
            iconName={<IoArrowBackOutline />}
            iconName2={<IoMdExit />}
            myNweets={myNweets}
            onLogOutClick={onLogOutClick}
          />
          {loading ? (
            <>
              <div className={styled.setUserInfo}>
                <div className={styled.backImage}>
                  <img src={creatorInfo.bgURL} alt="배경사진" />
                </div>

                <div className={styled.profile}>
                  <div className={styled.profile__edit}>
                    <div className={styled.profile__image}>
                      <img src={creatorInfo.photoURL} alt="프로필 이미지" />
                    </div>

                    {userObj.email === uid ? (
                      <div
                        className={styled.profile__editBtn}
                        onClick={toggleEdit}
                      >
                        프로필 수정
                      </div>
                    ) : (
                      <>
                        {myInfo.following.includes(creatorInfo.email) ? (
                          <div
                            className={`${styled.profile__editBtn} ${styled.follow} `}
                            onClick={() => toggleFollow(creatorInfo)}
                          >
                            <p>팔로잉</p>
                          </div>
                        ) : (
                          <div
                            className={`${styled.profile__editBtn} ${styled.profile__followBtn} `}
                            onClick={() => toggleFollow(creatorInfo)}
                          >
                            <p>팔로우</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={styled.profile__info}>
                    <div className={styled.userInfo}>
                      <p>{creatorInfo.displayName}</p>
                      <p>@{creatorInfo?.email?.split("@")[0]}</p>
                    </div>
                    <div className={styled.profile__desc}>
                      {creatorInfo.description === "" ? (
                        <p className={styled.notDesc}>소개글이 없습니다</p>
                      ) : (
                        <p>{creatorInfo.description}</p>
                      )}
                    </div>
                    <div className={styled.profile__createdAt}>
                      <BsCalendar3 />
                      <p>가입일 : {timeToString3(creatorInfo.createdAtId)}</p>
                    </div>
                    <div className={styled.profile__followInfo}>
                      <p>
                        <b>{creatorInfo.following?.length}</b> 팔로잉
                      </p>
                      <p>
                        <b>{creatorInfo.follower?.length}</b> 팔로워
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <nav className={styled.categoryList}>
                <SelectMenuBtn
                  num={1}
                  selected={selected}
                  url={
                    uid2.includes("user")
                      ? "/user/mynweets/" + uid
                      : "/profile/mynweets/" + uid
                  }
                  text={"트윗"}
                />
                <SelectMenuBtn
                  num={2}
                  selected={selected}
                  url={
                    uid2.includes("/user/")
                      ? "/user/replies/" + uid
                      : "/profile/replies/" + uid
                  }
                  text={"답글"}
                />
                <SelectMenuBtn
                  num={3}
                  selected={selected}
                  url={
                    uid2.includes("/user/")
                      ? "/user/renweets/" + uid
                      : "/profile/renweets/" + uid
                  }
                  text={"리트윗"}
                />

                <SelectMenuBtn
                  num={4}
                  selected={selected}
                  url={
                    uid2.includes("/user/")
                      ? "/user/likenweets/" + uid
                      : "/profile/likenweets/" + uid
                  }
                  text={"좋아요"}
                />
                {resize && userObj.email === uid && (
                  <SelectMenuBtn
                    num={5}
                    selected={selected}
                    url={"/profile/bookmarknweets/" + uid}
                    text={"북마크"}
                  />
                )}
              </nav>

              <Switch>
                <Route
                  path={
                    uid2.includes("/user/")
                      ? "/user/mynweets/" + uid
                      : "/profile/mynweets/" + uid
                  }
                >
                  <MyNweets myNweets={myNweets} userObj={userObj} />
                </Route>

                <Route
                  path={
                    uid2.includes("/user/")
                      ? "/user/replies/" + uid
                      : "/profile/replies/" + uid
                  }
                >
                  <Replies userObj={userObj} creatorInfo={creatorInfo} />
                </Route>

                <Route
                  path={
                    uid2.includes("/user/")
                      ? [
                          "/user/renweets/" + uid,
                          "/user/renweetsreplies/" + uid,
                        ]
                      : [
                          "/profile/renweets/" + uid,
                          "/profile/renweetsreplies/" + uid,
                        ]
                  }
                >
                  <ProfileReNweetBox
                    userObj={userObj}
                    creatorInfo={creatorInfo}
                  />
                </Route>

                <Route
                  path={
                    uid2.includes("/user/")
                      ? ["/user/likenweets/" + uid, "/user/likereplies/" + uid]
                      : [
                          "/profile/likenweets/" + uid,
                          "/profile/likereplies/" + uid,
                        ]
                  }
                >
                  <ProfileLikeBox userObj={userObj} />
                </Route>

                {userObj.email === uid && (
                  <Route
                    path={[
                      "/profile/bookmarknweets/" + uid,
                      "/profile/bookmarkreplies/" + uid,
                    ]}
                  >
                    <Bookmark userObj={userObj} />
                  </Route>
                )}
              </Switch>
            </>
          ) : (
            <CircleLoader />
          )}
        </div>
      </section>
      {isEditing && (
        <UpdateProfileModal
          creatorInfo={creatorInfo}
          setCreatorInfo={setCreatorInfo}
          isEditing={isEditing}
          toggleEdit={toggleEdit}
        />
      )}
    </>
  );
};

export default Profile;
