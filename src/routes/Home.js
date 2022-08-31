import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import styled from "./Home.module.css";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import Loading from "../components/Loading";
import { HiOutlineSparkles } from "react-icons/hi";
import { TopCategory } from "../components/TopCategory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const [loading, setLoading] = useState(false);

  // // getNweets 아래 로직은 오래된 방식
  // const getNweets = async () => {
  //   const dbNweets = await getDocs(collection(dbService, "nweets"));

  //   // QuerySnapShot = Collection으로 부터 Query, snapshot을 통해 받아온 데이터 타입
  //   // Collection으로부터 특정 Document를 가져왔기 때문에 forEach 반복문으로 하나씩 실행
  //   dbNweets.forEach((document) => {
  //     const nweetObject = {
  //       id: document.id,
  //       ...document.data(), // document 안에 있는 것들 꺼냄
  //     };
  //     // useState의 값 변경 함수(set~)를 쓸 때 값 대신 함수를 전달할 수 있는데
  //     // 그 때 이전 값에 접근할 수 있게 해준다
  //     setNweets((prev) => [nweetObject, ...prev]); // 새로운 것 <- 예전 것 순서
  //   });
  // };

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
      setLoading(true);

      // // forEach 사용 시 (리턴값 반환 X)
      // const nweetArrays = snapshot.docs.forEach((doc) => {
      //   const nweetObject = {
      //     id: doc.id,
      //     ...doc.data(),
      //   };
      //   setNweets((prev) => [nweetObject, ...prev]);
      // });
    });
    return () => setLoading(false);
  }, []);

  return (
    <>
      {loading && (
        <div className={styled.container}>
          <div className={styled.main__container}>
            <TopCategory text={"홈"} iconName={<HiOutlineSparkles />} />
            <NweetFactory userObj={userObj} />
            <div>
              {nweets.map((nweet) => (
                <Nweet
                  key={nweet.id}
                  nweetObj={nweet}
                  userObj={userObj}
                  isOwner={nweet.creatorId === userObj.uid}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
