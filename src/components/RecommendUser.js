import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { dbService } from "../fbase";
import styled from "./RecommendUser.module.css";
import noneProfile from "../image/noneProfile.jpg";
import { GrRefresh } from "react-icons/gr";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer/user";

const RecommendUser = ({ userObj }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [creatorInfos, setCreatorInfos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [myInfo, setMyInfo] = useState({});
  const [myInfos, setMyInfos] = useState({});

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setMyInfo(doc.data());
    });
  }, [creatorInfo, userObj.email]);

  const toggleFollow = useCallback(
    async (userInfo) => {
      if (myInfo.following?.includes(userInfo.email)) {
        // setFollow(false);
        const followCopy = [...myInfo.following];
        const followCopyFilter = followCopy.filter(
          (email) => email !== userInfo.email
        );

        const followAtCopy = [...myInfo.followAt];
        const followAtCopyFilter = followAtCopy.filter(
          (at) => !userInfo.followAt.includes(at)
        );

        const followerCopy = [...userInfo.follower];
        const followerCopyFilter = followerCopy.filter(
          (email) => email !== myInfo.email
        );

        const followerAtCopy = [...userInfo.followAt];
        const followerAtCopyFilter = followerAtCopy.filter(
          (at) => !myInfo.followAt.includes(at)
        );

        await updateDoc(doc(dbService, "users", myInfo.email), {
          following: followCopyFilter,
          followAt: followAtCopyFilter,
        });
        await updateDoc(doc(dbService, "users", userInfo.email), {
          follower: followerCopyFilter,
          followAt: followerAtCopyFilter,
        });
        dispatch(
          setCurrentUser({
            ...currentUser,
            following: myInfo.following,
            follower: myInfo.follower,
            followAt: myInfo.followAt,
          })
        );
      } else {
        // setFollow(true);
        const time = Date.now();
        const followCopy = [...myInfo.following, userInfo.email];
        const followAtCopy = [...myInfo.followAt, time];
        const followerCopy = [...userInfo.follower, myInfo.email];
        const followerAtCopy = [...userInfo.followAt, time];

        await updateDoc(doc(dbService, "users", myInfo.email), {
          following: followCopy,
          followAt: followAtCopy,
        });
        await updateDoc(doc(dbService, "users", userInfo.email), {
          follower: followerCopy,
          followAt: followerAtCopy,
        });

        dispatch(
          setCurrentUser({
            ...currentUser,
            following: myInfo.following,
            follower: myInfo.follower,
            followAt: myInfo.followAt,
          })
        );
      }
    },
    [
      currentUser,
      dispatch,
      myInfo.email,
      myInfo.followAt,
      myInfo.follower,
      myInfo.following,
    ]
  );

  const randomArray = (array) => {
    array.sort(() => Math.floor(Math.random() - 0.5));
  };

  const onRefresh = () => {
    setRefresh(!refresh);
  };

  // 실시간 문서 받아오기로 인한 무분별한 리렌더링 발생
  // (만약 수많은 사람이 한번에 프로필 변경 할 시 계속 리렌더링 되기 때문)
  useEffect(() => {
    const q = query(collection(dbService, "users"), orderBy("follower", "asc"));

    onSnapshot(q, (snapshot) => {
      const usersArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //  본인 제외 노출
      const exceptArray = usersArray.filter((name) => name.uid !== userObj.uid);
      // randomArray(usersArray);
      setCreatorInfo(exceptArray);
    });
  }, []);

  // 무분별한 리렌더링 방지 (실시간 문서 받아오기 x)
  // (새로고침(랜덤 함수) 버튼 누를 때만 리렌더링 되도록 함)
  // useEffect(() => {
  //   const userInfo = async () => {
  //     const q = query(collection(dbService, "users"));
  //     const data = await getDocs(q);

  //     const userArray = data.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     // 본인 제외 노출
  //     const exceptArray = userArray.filter((name) => name.uid !== userObj.uid);

  //     // randomArray(exceptArray);
  //     setCreatorInfo(exceptArray);
  //   };

  //   userInfo();
  // }, [refresh, userObj.uid]);

  const showMore = () => {
    history.push("/explore/users/");
  };

  const goPage = (user) => {
    if (userObj.email !== user.email) {
      history.push("/user/mynweets/" + user.email);
    } else {
      console.log("error");
    }
  };

  return (
    <section className={styled.followBox}>
      <div className={styled.followBox__name}>
        <h2>팔로우 추천</h2>
        <div onClick={onRefresh} className={styled.actions__icon}>
          {/* <GrRefresh /> */}
        </div>
      </div>
      <ul className={styled.follows}>
        {creatorInfo.map((user, index) => {
          /* 팔로우 안 되어 있는 것들 보여주기 */
          // {!myInfo.following.includes(user.email) && }
          if (index < 5) {
            return (
              <li key={user.id} className={styled.follow__user}>
                <div
                  className={styled.follow__userInfo}
                  onClick={() => goPage(user)}
                >
                  <img
                    src={user.photoURL ? user.photoURL : noneProfile}
                    alt="profileImg"
                    className={styled.follow__image}
                  />
                  <div className={styled.follow__name}>
                    <p>{user.displayName}</p>
                    <p>@{user.email.split("@")[0]}</p>
                  </div>
                </div>
                {myInfo.following?.includes(user.email) ? (
                  <div
                    className={`${styled.follow__btn} ${styled.follow} `}
                    onClick={() => toggleFollow(user)}
                  >
                    <p>팔로잉</p>
                  </div>
                ) : (
                  <div
                    className={`${styled.follow__btn} ${styled.profile__followBtn} `}
                    onClick={() => toggleFollow(user)}
                  >
                    <p>팔로우</p>
                  </div>
                )}
              </li>
            );
          } else return null;
        })}
      </ul>
      <div className={styled.more} onClick={showMore}>
        더 보기
      </div>
    </section>
  );
};

export default RecommendUser;
