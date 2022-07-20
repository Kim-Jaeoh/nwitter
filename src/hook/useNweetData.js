import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";
import { dbService } from "../fbase";

const useNweetData = () => {
  const [nweets, setNweets] = useState([]);

  // query는 데이터를 요청할 때 사용됨
  const 제발좀 = () => {
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

      // // forEach 사용 시 (리턴값 반환 X)
      // const nweetArrays = snapshot.docs.forEach((doc) => {
      //   const nweetObject = {
      //     id: doc.id,
      //     ...doc.data(),
      //   };
      //   setNweets((prev) => [nweetObject, ...prev]);
      // });
    });
  };
  return [nweets, 제발좀];
};

export default useNweetData;
