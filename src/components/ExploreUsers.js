import React from "react";
import styled from "./ExploreUsers.module.css";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../fbase";

const ExploreUsers = ({ userObj }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  //     // 유저 랜덤
  //     const randomArray = (array) => {
  //       array.sort(() => Math.floor(Math.random() - 0.5));
  //     };

  //     randomArray(exceptArray);
  //     setUsers(exceptArray);
  //   };
  //   userInfo();
  // }, [userObj.uid]);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  useEffect(() => {
    const q = query(collection(dbService, "users"));

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

      randomArray(exceptArray);
      setUsers(exceptArray);
      setLoading(true);
    });
  }, [userObj.uid]);

  return (
    <>
      {loading && (
        <div className={styled.followBox}>
          {users.length !== 0 && (
            <ul className={styled.follows}>
              {users.map((user) => (
                <li key={user.id} className={styled.follow__user}>
                  <div className={styled.follow__userInfo}>
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
                  <div className={styled.follow__btn}>팔로우</div>
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
