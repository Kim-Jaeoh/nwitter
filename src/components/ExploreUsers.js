import React, { useRef } from "react";
import styled from "./ExploreUsers.module.css";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer/user";
import { useHistory } from "react-router-dom";

const ExploreUsers = ({ userObj }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const btnRef = useRef();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  const [myInfo, setMyInfo] = useState({});
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   return () => setLoading(false);
  // }, []);

  // 유저 정보 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "users"), orderBy("follower", "asc"));

    onSnapshot(q, (snapshot) => {
      const userArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 본인 제외 노출
      const exceptArray = userArray.filter((name) => name.uid !== userObj.uid);

      // 유저 랜덤
      const randomArray = (array) => {
        array.sort(() => Math.floor(Math.random() - 0.5));
      };

      // randomArray(exceptArray);
      setUsers(exceptArray);
      setLoading(true);
    });
  }, [userObj.uid]);

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setMyInfo(doc.data());
    });
  }, [userObj.email]);

  const toggleFollow = async (user) => {
    if (myInfo.following?.includes(user.email)) {
      // setFollow(false);
      const followCopy = [...myInfo.following];
      const followCopyFilter = followCopy.filter(
        (email) => email !== user.email
      );

      const followAtCopy = [...myInfo.followAt];
      const followAtCopyFilter = followAtCopy.filter(
        (at) => !user.followAt.includes(at)
      );

      const followerCopy = [...user.follower];
      const followerCopyFilter = followerCopy.filter(
        (email) => email !== myInfo.email
      );

      const followerAtCopy = [...user.followAt];
      const followerAtCopyFilter = followerAtCopy.filter(
        (at) => !myInfo.followAt.includes(at)
      );

      await updateDoc(doc(dbService, "users", myInfo.email), {
        following: followCopyFilter,
        followAt: followAtCopyFilter,
      });
      await updateDoc(doc(dbService, "users", user.email), {
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
      const followCopy = [...myInfo.following, user.email];
      const followAtCopy = [...myInfo.followAt, time];
      const followerCopy = [...user.follower, myInfo.email];
      const followerAtCopy = [...user.followAt, time];

      await updateDoc(doc(dbService, "users", myInfo.email), {
        following: followCopy,
        followAt: followAtCopy,
      });
      await updateDoc(doc(dbService, "users", user.email), {
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
  };

  const goPage = (user, e) => {
    if (!btnRef.current?.contains(e.target)) {
      history.push("/user/mynweets/" + user.email);
    }
  };

  return (
    <>
      {loading && (
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
      )}
    </>
  );
};

export default ExploreUsers;
