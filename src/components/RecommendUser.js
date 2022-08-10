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
    <ul className={styled.follows}>
      {users.map((user) => {
        return (
          <li key={user.id} className={styled.follow__user}>
            <img
              src={user.photoURL ? user.photoURL : noneProfile}
              alt="profileImg"
              className={styled.follow__image}
            />
            <div className={styled.follow__name}>
              <p>{user.displayName}</p>
              <p>@{user.email.split("@")[0]}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default RecommendUser;
