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
import styled from "./RecommendUser.module.css";
import noneProfile from "../../image/noneProfile.jpg";
import { useHistory } from "react-router-dom";
import { GrRefresh } from "react-icons/gr";
import { useToggleFollow } from "../../hooks/useToggleFollow";
import CircleLoader from "../loader/CircleLoader";

const RecommendUser = ({ userObj }) => {
  const history = useHistory();
  const [myInfo, setMyInfo] = useState({});
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setMyInfo(doc.data());
    });
  }, [userObj.email]);

  const toggleFollow = useToggleFollow(myInfo);

  // 실시간 문서 받아오기로 인한 무분별한 리렌더링 발생
  // (만약 수많은 사람이 한번에 프로필 변경 할 시 계속 리렌더링 되기 때문)
  useEffect(() => {
    const q = query(
      collection(dbService, "users"),
      orderBy("follower", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const usersArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //  본인 제외 노출
      const exceptArray = usersArray.filter((name) => name.uid !== userObj.uid);

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

      setCreatorInfo(exceptArray);
      setLoading(true);
    });
  }, [refresh]);

  // 새로고침
  const onRefresh = () => {
    setRefresh(!refresh);
  };

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

  //     setCreatorInfo(exceptArray);
  //   };

  //   userInfo();
  // }, [refresh]);

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
      {loading ? (
        <>
          <div className={styled.followBox__name}>
            <h2>팔로우 추천</h2>
            {/* <div onClick={onRefresh} className={styled.actions__icon}> */}
            {/* <GrRefresh /> */}
            {/* </div> */}
          </div>
          <ul className={styled.follows}>
            {creatorInfo.map((userInfo, index) => {
              if (index < 5) {
                return (
                  <div key={userInfo.id}>
                    {/* 팔로우 안 되어 있는 것들 보여주기 */}
                    {/* {!myInfo.following.includes(userInfo.email) && ( */}
                    <li className={styled.follow__user}>
                      <div
                        className={styled.follow__userInfo}
                        onClick={() => goPage(userInfo)}
                      >
                        <img
                          src={
                            userInfo.photoURL ? userInfo.photoURL : noneProfile
                          }
                          alt="profileImg"
                          className={styled.follow__image}
                        />
                        <div className={styled.follow__name}>
                          <p>{userInfo.displayName}</p>
                          <p>@{userInfo.email.split("@")[0]}</p>
                        </div>
                      </div>
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
                    </li>
                    {/* )} */}
                  </div>
                );
              } else return null;
            })}
          </ul>
          <div className={styled.more} onClick={showMore}>
            더 보기
          </div>
        </>
      ) : (
        <CircleLoader />
      )}
    </section>
  );
};

export default RecommendUser;