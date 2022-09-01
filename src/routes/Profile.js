import React, { useCallback, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { authService, dbService } from "../fbase";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLoginToken } from "../reducer/user";
import styled from "./Profile.module.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { BsCalendar3 } from "react-icons/bs";
import UpdateProfileModal from "../components/UpdateProfileModal";
import MyNweets from "../components/MyNweets";
import ReNweets from "../components/ReNweets";
import LikeNweets from "../components/LikeNweets";
import SelectMenuBtn from "../components/SelectMenuBtn";
import Loading from "../components/Loading";
import { IoMdExit } from "react-icons/io";
import { TopCategory } from "../components/TopCategory";

const Profile = ({ refreshUser, userObj }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const history = useHistory();
  const [creatorInfo, setCreatorInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [myNweets, setMyNweets] = useState([]);
  const [myLikeNweets, setMyLikeNweets] = useState([]);
  const [selected, setSelected] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/mynweets")) {
      setSelected(1);
    } else if (location.pathname.includes("/renweets")) {
      setSelected(2);
    } else if (location.pathname.includes("/likenweets")) {
      setSelected(3);
    }
  }, [location.pathname]);

  // 필터링 방법 (본인이 작성한 것 확인)
  const getMyNweets = useCallback(() => {
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

  useEffect(() => {
    return () => setLoading(false); // cleanup function을 이용
  }, []);

  // 렌더링 시 실시간 정보 가져오고 이메일, 닉네임, 사진 바뀔 때마다 리렌더링(업데이트)
  useEffect(() => {
    onSnapshot(doc(dbService, "users", uid), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
      getMyNweets();
    });
  }, [getMyNweets, uid]);

  // 좋아요 필터링
  useEffect(() => {
    // query는 데이터를 요청할 때 사용됨
    const q = query(
      collection(dbService, "nweets"),
      where("like", "array-contains", uid)
    );

    onSnapshot(q, (querySnapshot) => {
      const array = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyLikeNweets(array);
    });

    // forEach
    // onSnapshot(q, (querySnapshot) => {
    //   const array = [];
    //   querySnapshot.forEach((doc) => {
    //     array.push({ id: doc.id, ...doc.data() });
    //   });
    //   setMyLikeNweets(array);
    // });
  }, [uid]);

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
          rejweet: [],
        })
      );
      history.push("/auth");
    }
  };

  const timeToString = (timestamp) => {
    let date = new Date(timestamp);
    let str =
      date.getFullYear() +
      "년 " +
      Number(date.getMonth() + 1) +
      "월 " +
      date.getDate() +
      "일 ";
    return str;
  };

  const onSelect = (num) => {
    setSelected(num);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      {loading && (
        <section className={styled.container}>
          <div className={styled.main__container}>
            <TopCategory
              text={creatorInfo.displayName}
              iconName={<IoArrowBackOutline />}
              iconName2={<IoMdExit />}
              myNweets={myNweets}
              onLogOutClick={onLogOutClick}
            />
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
                  ) : null}
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
                    <p>가입일 : {timeToString(creatorInfo.createdAtId)}</p>
                  </div>
                </div>
              </div>
            </div>
            <nav className={styled.categoryList}>
              <SelectMenuBtn
                num={1}
                selected={selected}
                onClick={() => onSelect(1)}
                url={"/profile/mynweets/" + uid}
                text={"트윗"}
              />
              <SelectMenuBtn
                num={2}
                selected={selected}
                onClick={() => onSelect(2)}
                url={"/profile/renweets/" + uid}
                text={"트윗 및 답글"}
              />
              <SelectMenuBtn
                num={3}
                selected={selected}
                onClick={() => onSelect(3)}
                url={"/profile/likenweets/" + uid}
                text={"마음에 들어요"}
              />
            </nav>

            {loading ? (
              <Switch>
                <Route path="/profile/mynweets/:id">
                  <MyNweets myNweets={myNweets} userObj={creatorInfo} />
                </Route>
                <Route path="/profile/renweets/:id">
                  <ReNweets userObj={creatorInfo} />
                </Route>
                <Route path="/profile/likenweets/:id">
                  <LikeNweets
                    myLikeNweets={myLikeNweets}
                    userObj={creatorInfo}
                  />
                </Route>
              </Switch>
            ) : (
              <Loading />
            )}
          </div>
        </section>
      )}
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
