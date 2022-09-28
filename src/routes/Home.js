import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import styled from "./Home.module.css";
import Nweet from "../components/nweet/Nweet";
import NweetFactory from "../components/nweet/NweetFactory";
// import Loading from "../components/Loading";
import { HiOutlineSparkles } from "react-icons/hi";
import { TopCategory } from "../components/topCategory/TopCategory";
import { useInView } from "react-intersection-observer";
import CircleLoader from "../components/Loader/CircleLoader";
import { useDispatch, useSelector } from "react-redux";
import { setProgressBar } from "../reducer/user";

const Home = ({ userObj }) => {
  const [ref, inView] = useInView();
  const [nweets, setNweets] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const currentProgressBar = useSelector((state) => state.user.load);

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
    );

    onSnapshot(q, (snapshot) => {
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

      //   // // forEach 사용 시 (리턴값 반환 X)
      //   // const nweetArrays = snapshot.docs.forEach((doc) => {
      //   //   const nweetObject = {
      //   //     id: doc.id,
      //   //     ...doc.data(),
      //   //   };
      //   //   setNweets((prev) => [nweetObject, ...prev]);
      //   // });
    });
  }, [currentProgressBar.load, dispatch]);

  // 리트윗 정보
  useEffect(() => {
    const q = query(collection(dbService, "reNweets"));

    onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReNweets(reNweetArray);
    });
  }, []);

  return (
    <>
      <div className={styled.container}>
        <div className={styled.main__container}>
          <TopCategory
            home={"home"}
            text={"홈"}
            iconName={<HiOutlineSparkles />}
          />
          <NweetFactory userObj={userObj} />
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
            <div ref={ref} />
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
