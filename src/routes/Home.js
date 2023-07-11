import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import styled from "./Home.module.css";
import Nweet from "../components/nweet/Nweet";
import NweetFactory from "../components/nweet/NweetFactory";
import { HiOutlineSparkles } from "react-icons/hi";
import { TopCategory } from "../components/topCategory/TopCategory";
import CircleLoader from "../components/loader/CircleLoader";
import { useDispatch, useSelector } from "react-redux";
import BarLoader from "../components/loader/BarLoader";
import { setNotModal } from "../reducer/user";
import useGetFbInfo from "../hooks/useGetFbInfo";

const Home = ({ userObj }) => {
  const dispatch = useDispatch();
  const currentNotModal = useSelector((state) => state.user.modal);
  const currentProgressBar = useSelector((state) => state.user.load);
  const [nweets, setNweets] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [users, setUsers] = useState([]);
  const { myInfo } = useGetFbInfo();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(setNotModal({ modal: true }));
  }, [dispatch]);

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // map 사용 시 - 더 적게 리렌더링 하기 때문에 map 사용이 나음
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNweets(nweetArray);

      if (nweetArray) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 리트윗 정보
  useEffect(() => {
    const q = query(collection(dbService, "reNweets"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReNweets(reNweetArray);
    });

    return () => unsubscribe();
  }, []);

  // const click = async () => {
  //   const dd = async (el) =>
  //   myInfo.follower.map(async (dd)=>{
  //     await addDoc(doc(dbService, "users", userObj.email), {
  //       follow: [...el.follow, { email: dd.email, followAt: dd.followingAt }],
  //     });
  //   })

  //   users.map((asd) => dd(asd));
  // };

  // const [ss, setSs] = useState([]);
  // const d = "ym9880@gmail.com";
  // const [info, setInfo] = useState([]);

  // // 본인 정보 가져오기
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(doc(dbService, "users", d), (doc) => {
  //     setInfo(doc.data());
  //   });

  //   return () => unsubscribe();
  // }, []);

  // const click = () => {
  //   if (info) {
  //     info?.follower.map(async (a, index) => {
  //       setSs((prev) => [
  //         ...prev,
  //         {
  //           email: a,
  //           followAt: info.followerAt[index],
  //         },
  //       ]);
  //     });
  //   }
  // };

  // const listFollowingClick = () => {
  //   if (info) {
  //     info?.following.map(async (a, index) => {
  //       setSs((prev) => [
  //         ...prev,
  //         {
  //           email: a,
  //           followAt: info.followingAt[index],
  //         },
  //       ]);
  //     });
  //   }
  // };

  // const followerClick = () => {
  //   info.follower.forEach(async (a, index) => {
  //     await updateDoc(doc(dbService, "users", d), {
  //       follower: ss,
  //     });
  //   });
  // };

  // const followingClick = () => {
  //   info.following.forEach(async (a, index) => {
  //     await updateDoc(doc(dbService, "users", d), {
  //       following: ss,
  //     });
  //   });
  // };

  // useEffect(() => {
  //   console.log(ss);
  // }, [ss]);

  return (
    <>
      <div className={styled.container}>
        <div className={styled.main__container}>
          <TopCategory
            home={"home"}
            text={"홈"}
            // iconName={<HiOutlineSparkles />}
          />
          {/* <div onClick={click}>팔로워목록</div>
          <div onClick={followerClick}>팔로워</div>
          <div onClick={listFollowingClick}>팔로잉목록</div>
          <div onClick={followingClick}>팔로잉</div> */}
          {/* {currentProgressBar?.load && currentNotModal.modal && <BarLoader />} */}
          {loading && <NweetFactory userObj={userObj} />}
          <ul>
            {loading ? (
              <>
                {nweets.map((nweet, index) => (
                  <Nweet
                    key={nweet.id}
                    nweetObj={nweet}
                    reNweetsObj={reNweets}
                    userObj={userObj}
                    isOwner={nweet.creatorId === userObj.uid}
                  />
                ))}
              </>
            ) : (
              <CircleLoader />
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
