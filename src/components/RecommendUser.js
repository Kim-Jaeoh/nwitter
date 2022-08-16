import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../fbase";
import styled from "./RecommendUser.module.css";
import noneProfile from "../image/noneProfile.jpg";

const RecommendUser = ({ userObj }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(dbService, "users"));

    onSnapshot(q, (snapshot) => {
      const usersArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersArray);
    });
  }, []);

  return (
    <section className={styled.followBox}>
      <div className={styled.followBox__name}>
        <h2>팔로우 추천</h2>
      </div>
      <ul className={styled.follows}>
        {users.map((user) => {
          return (
            <li key={user.id} className={styled.follow__user}>
              <div className={styled.follow__userInfo}>
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
              <div className={styled.follow__btn}>팔로우</div>
            </li>
          );
        })}
      </ul>
      <div className={styled.more}>더 보기</div>
    </section>
  );
};

export default RecommendUser;
