import React, { useCallback, useRef } from "react";
import styled from "./ExploreUsers.module.css";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import { useHistory, useLocation } from "react-router-dom";
import { useToggleFollow } from "../../hooks/useToggleFollow";
import CircleLoader from "../loader/CircleLoader";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../reducer/user";

const ExploreUsers = ({ userObj }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const btnRef = useRef();
  const [users, setUsers] = useState([]);
  const [myInfo, setMyInfo] = useState({});
  const [followInfo, setFollowInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const toggleFollow = useToggleFollow(myInfo);

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setMyInfo(doc.data());
    });
  }, [currentUser.follow, userObj.email]);

  // 팔로우 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "follow")
      // ,orderBy("follower", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const userArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // // 본인 제외 노출
      // const exceptArray = userArray.filter((name) => name.uid !== userObj.uid);

      setFollowInfo(userArray);
    });
  }, []);

  // // 실시간 문서 받아오기로 인한 무분별한 리렌더링 발생
  // // (만약 수많은 사람이 한번에 프로필 변경 할 시 계속 리렌더링 되기 때문)

  useEffect(() => {
    const q = query(
      collection(dbService, "users"),
      orderBy("follower", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const userArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 본인 제외 노출
      const exceptArray = userArray.filter((name) => name.uid !== userObj.uid);

      // // 랜덤 함수
      // const randomArray = (array) => {
      //   // 방법 1
      //   // array.sort(() => Math.floor(Math.random() - 0.5));

      //   // 방법 2 (피셔-예이츠)
      //   for (let index = array.length - 1; index > 0; index--) {
      //     // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      //     const randomPosition = Math.floor(Math.random() * (index + 1));

      //     // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
      //     const temporary = array[index];
      //     array[index] = array[randomPosition];
      //     array[randomPosition] = temporary;
      //   }
      // };

      // randomArray(exceptArray);
      setUsers(exceptArray);
      setLoading(true);
    });
  }, []);

  // 무분별한 리렌더링 방지 (실시간 문서 받아오기 x)
  // (새로고침(랜덤 함수) 버튼 누를 때만 리렌더링 되도록 함) 단점은 로딩이 길다..
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

  //     // 랜덤 함수
  //     const randomArray = (array) => {
  //       // 방법 1
  //       // array.sort(() => Math.floor(Math.random() - 0.5));

  //       // 방법 2 (피셔-예이츠)
  //       for (let index = array.length - 1; index > 0; index--) {
  //         // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
  //         const randomPosition = Math.floor(Math.random() * (index + 1));

  //         // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
  //         const temporary = array[index];
  //         array[index] = array[randomPosition];
  //         array[randomPosition] = temporary;
  //       }
  //     };

  //     randomArray(exceptArray);
  //     setUsers(exceptArray);

  //     setLoading(true);
  //   };

  //   userInfo();
  // }, []);

  const goPage = (user, e) => {
    if (!btnRef.current?.contains(e.target)) {
      history.push("/user/mynweets/" + user.email);
    }
  };

  return (
    <>
      {loading ? (
        <div className={styled.followBox}>
          {users.length !== 0 && (
            <ul className={styled.follows}>
              {users.map((userInfo) => (
                <li key={userInfo.id} className={styled.follow__user}>
                  <div
                    className={styled.follow__userInfo}
                    onClick={(e) => goPage(userInfo, e)}
                  >
                    <img
                      src={userInfo.photoURL}
                      alt="profileImg"
                      className={styled.follow__image}
                    />
                    <div className={styled.follow__name}>
                      <p>{userInfo.displayName}</p>
                      <p>@{userInfo.email?.split("@")[0]}</p>
                      {userInfo.description && <p>: {userInfo.description}</p>}
                    </div>
                  </div>
                  <div ref={btnRef}>
                    {myInfo.following?.includes(userInfo.email) ? (
                      <div
                        className={`${styled.follow__btn} ${styled.follow} `}
                        onClick={() => toggleFollow(userInfo)}
                      >
                        <p>팔로잉</p>
                      </div>
                    ) : (
                      <div
                        className={`${styled.follow__btn} ${styled.profile__followBtn} `}
                        onClick={() => toggleFollow(userInfo)}
                      >
                        <p>팔로우</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <CircleLoader height={60} />
      )}
    </>
  );
};

export default ExploreUsers;
