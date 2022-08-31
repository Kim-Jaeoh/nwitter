import styled from "./ExploreUsers.module.css";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../fbase";

export const ExploreUsers = ({ userObj }) => {
  const [users, setUsers] = useState([]);
  // const [refresh, setRefresh] = useState(false);

  const randomArray = (array) => {
    array.sort(() => Math.floor(Math.random() - 0.5));
  };

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

      randomArray(exceptArray);
      setUsers(exceptArray);
    };

    userInfo();
  }, [userObj.uid]);

  return (
    <div className={styled.followBox}>
      <ul className={styled.follows}>
        {users.map((user, index) => {
          if (index < 5) {
            return (
              <li key={user.id} className={styled.follow__user}>
                <div className={styled.follow__userInfo}>
                  <img
                    src={user.photoURL}
                    alt="profileImg"
                    className={styled.follow__image}
                  />
                  <div className={styled.follow__name}>
                    <p>{user.displayName}</p>
                    <p>@{user.email.split("@")[0]}</p>
                    {user.description && <p>: {user.description}</p>}
                  </div>
                </div>
                <div className={styled.follow__btn}>팔로우</div>
              </li>
            );
          } else return null;
        })}
      </ul>
    </div>
  );
};
