import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../fbase";
import { useSelector } from "react-redux";

const useGetFbInfo = () => {
  const [myInfo, setMyInfo] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);

  // 본인 정보 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(dbService, "users", currentUser.email),
      (doc) => {
        setMyInfo(doc.data());
      }
    );

    return () => unsubscribe();
  }, [currentUser.email]);

  return { myInfo };
};

export default useGetFbInfo;
