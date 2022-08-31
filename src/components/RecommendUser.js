import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../fbase";
import styled from "./RecommendUser.module.css";
import noneProfile from "../image/noneProfile.jpg";
import { GrRefresh } from "react-icons/gr";
import { useHistory } from "react-router-dom";

const RecommendUser = ({ userObj }) => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const randomArray = (array) => {
    array.sort(() => Math.floor(Math.random() - 0.5));
  };

  const onRefresh = () => {
    setRefresh(!refresh);
  };

  // 실시간 문서 받아오기로 인한 무분별한 리렌더링 발생
  // (만약 수많은 사람이 한번에 프로필 변경 할 시 계속 리렌더링 되기 때문)
  // useEffect(() => {
  //   console.log(refresh);
  //   const q = query(collection(dbService, "users"));

  //   onSnapshot(q, (snapshot) => {
  //     const usersArray = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     randomArray(usersArray);
  //     setUsers(usersArray);
  //   });
  // }, [refresh]);

  // 무분별한 리렌더링 방지 (실시간 문서 받아오기 x)
  // (새로고침(랜덤 함수) 버튼 누를 때만 리렌더링 되도록 함)
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
  }, [refresh, userObj.uid]);

  const goPage = (user) => {
    if (userObj.email !== user.email) {
      history.push("/profile/mynweets/" + user.email);
    } else {
      console.log("error");
    }
  };

  const showMore = () => {
    history.push("/explore/users/");
  };

  return (
    <section className={styled.followBox}>
      <div className={styled.followBox__name}>
        <h2>팔로우 추천</h2>
        <div onClick={onRefresh} className={styled.actions__icon}>
          <GrRefresh />
        </div>
      </div>
      <ul className={styled.follows}>
        {users.map((user, index) => {
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
                <div className={styled.follow__btn}>팔로우</div>
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
