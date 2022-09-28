import React, { useRef } from "react";
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
import { useHistory } from "react-router-dom";
import { useToggleFollow } from "../../hooks/useToggleFollow";
import CircleLoader from "../Loader/CircleLoader";

const ExploreUsers = ({ userObj }) => {
  const history = useHistory();
  const btnRef = useRef();
  const [users, setUsers] = useState([]);
  const [myInfo, setMyInfo] = useState({});
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   return () => setLoading(false);
  // }, []);

  // // 실시간 문서 받아오기로 인한 무분별한 리렌더링 발생
  // // (만약 수많은 사람이 한번에 프로필 변경 할 시 계속 리렌더링 되기 때문)
  // useEffect(() => {
  //   const q = query(collection(dbService, "users"), orderBy("follower", "asc"));

  //   onSnapshot(q, (snapshot) => {
  //     const userArray = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     // 본인 제외 노출
  //     const exceptArray = userArray.filter((name) => name.uid !== userObj.uid);

  //     // 유저 랜덤
  //     const randomArray = (array) => {
  //       array.sort(() => Math.floor(Math.random() - 0.5));
  //     };

  //     randomArray(exceptArray);
  //     setUsers(exceptArray);
  //     setLoading(true);
  //   });
  // }, [userObj.uid]);

  // 무분별한 리렌더링 방지 (실시간 문서 받아오기 x)
  // (새로고침(랜덤 함수) 버튼 누를 때만 리렌더링 되도록 함) 단점은 로딩이 길다..
  useEffect(() => {
    const userInfo = async () => {
      const q = query(collection(dbService, "users"));
      const data = await getDocs(q);

      const userArray = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 본인 제외 노출
      const exceptArray = userArray.filter((name) => name.uid !== userObj.uid);

      const randomArray = (array) =>
        array.sort(() => Math.floor(Math.random() - 0.5));

      randomArray(exceptArray);
      setUsers(exceptArray);
      setLoading(true);
    };

    userInfo();
  }, [userObj.uid]);

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setMyInfo(doc.data());
    });
  }, [userObj.email]);

  const toggleFollow = useToggleFollow(myInfo);

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
              {users.map((user) => (
                <li key={user.id} className={styled.follow__user}>
                  <div
                    className={styled.follow__userInfo}
                    onClick={(e) => goPage(user, e)}
                  >
                    <img
                      src={user.photoURL}
                      alt="profileImg"
                      className={styled.follow__image}
                    />
                    <div className={styled.follow__name}>
                      <p>{user.displayName}</p>
                      <p>@{user.email?.split("@")[0]}</p>
                      {user.description && <p>: {user.description}</p>}
                    </div>
                  </div>
                  <div ref={btnRef}>
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
