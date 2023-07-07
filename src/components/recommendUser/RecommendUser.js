import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import styled from "./RecommendUser.module.css";
import noneProfile from "../../image/noneProfile.jpg";
import { useHistory } from "react-router-dom";
import { useToggleFollow } from "../../hooks/useToggleFollow";
import CircleLoader from "../loader/CircleLoader";
import { cloneDeep } from "lodash";
import { GrRefresh } from "react-icons/gr";
import useGetFbInfo from "../../hooks/useGetFbInfo";
import { Link } from "react-router-dom";
import TopButton from "../button/TopButton";

const RecommendUser = ({ userObj }) => {
  const history = useHistory();
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const { myInfo } = useGetFbInfo();
  const toggleFollow = useToggleFollow(myInfo);

  // 무분별한 리렌더링 방지 (실시간 문서 받아오기 x)
  // (새로고침(랜덤 함수) 버튼 누를 때만 리렌더링 되도록 함)
  useEffect(() => {
    const userInfo = async () => {
      const q = query(collection(dbService, "users"));
      const data = await getDocs(q);
      return data.docs.map((doc) => doc.data());
    };

    userInfo().then((userArray) => {
      // 본인 제외 노출
      const exceptArray = userArray.filter(
        (name) => name.email !== myInfo?.email
      );

      // 팔로우 안 되어 있는 유저
      const notFollowed = exceptArray?.filter(
        (res) => !myInfo?.following.includes(res.email)
      );

      let cloneArr = cloneDeep(notFollowed);

      randomArray(cloneArr);
      setCreatorInfo(cloneArr);
      setLoading(true);
    });
  }, [myInfo?.email, refresh]);

  // 랜덤 함수
  const randomArray = (array) => {
    // (피셔-예이츠)
    for (let index = array?.length - 1; index > 0; index--) {
      // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
      const randomPosition = Math.floor(Math.random() * (index + 1));

      // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
      const temporary = array[index];
      array[index] = array[randomPosition];
      array[randomPosition] = temporary;
    }
  };

  // 새로고침
  const onRefresh = () => {
    setRefresh(!refresh);
  };

  const showMore = () => {
    history.push("/explore/users/");
  };

  return (
    <section className={styled.followBox}>
      {loading ? (
        <>
          <div className={styled.followBox__name}>
            <h2>팔로우 추천</h2>
            <div onClick={onRefresh} className={styled.actions__icon}>
              <GrRefresh />
            </div>
          </div>
          <ul className={styled.follows}>
            {creatorInfo.slice(0, 5).map((userInfo, index) => {
              return (
                <div key={userInfo.uid}>
                  <li className={styled.follow__user}>
                    <Link
                      className={styled.follow__userInfo}
                      to={`/profile/mynweets/${userInfo.email}`}
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
                    </Link>
                    {myInfo?.following?.includes(userInfo.email) ? (
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
                </div>
              );
            })}
          </ul>
          <Link className={styled.more} to={"/explore/users/"}>
            더 보기
          </Link>
        </>
      ) : (
        <CircleLoader />
      )}
    </section>
  );
};

export default RecommendUser;
