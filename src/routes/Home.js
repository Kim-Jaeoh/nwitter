import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import Loading from "../components/Loading";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const [isLoading, setIsLoading] = useState(null);

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
    setIsLoading(true); // 렌더링 후 로딩 스피너 on

    // query는 데이터를 요청할 때 사용됨
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc") // asc(오름차순), desc(내림차순)
    );

    // onSnapshot은 실시간으로 정보를 가져올 수 있음
    onSnapshot(q, (snapshot) => {
      // map 사용 시 - 더 적게 리렌더링 하기 때문에 map 사용이 나음
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
      setIsLoading(false); // obj 부른 후 로딩 종료 시 스피너 off

      // // forEach 사용 시 (리턴값 반환 X)
      // const nweetArrays = snapshot.docs.forEach((doc) => {
      //   const nweetObject = {
      //     id: doc.id,
      //     ...doc.data(),
      //   };
      //   setNweets((prev) => [nweetObject, ...prev]);
      // });
    });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      {isLoading && <Loading />} {/* 로딩 시 스피너 */}
      <div style={{ marginTop: 30 }}>
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
  );
};

export default Home;
