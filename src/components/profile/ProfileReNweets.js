import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbService } from "../../fbase";
import styled from "./SelectNoInfo.module.css";
import Nweet from "../nweet/Nweet";
import CircleLoader from "../loader/CircleLoader";
import useGetFbInfo from "../../hooks/useGetFbInfo";

const ProfileReNweets = ({ userObj, creatorInfo }) => {
  const [ogNweets, setOgNweets] = useState([]);
  const { reNweets } = useGetFbInfo();

  // 원글의 리트윗 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("reNweet", "array-contains", creatorInfo.email)
    );
    const unsubscribe = onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOgNweets(userArray);
    });

    return () => unsubscribe();
  }, [creatorInfo.email]);

  return (
    <>
      {reNweets ? (
        <>
          {ogNweets.length !== 0 ? (
            <div>
              {ogNweets.map((reNweet) => (
                <Nweet
                  isOwner={reNweet.creatorId === userObj.uid}
                  key={reNweet.id}
                  nweetObj={reNweet}
                  userObj={userObj}
                  reNweetsObj={reNweets}
                />
              ))}
            </div>
          ) : (
            <div className={styled.noInfoBox}>
              <div className={styled.noInfo}>
                <h2>아직 리트윗한 트윗이 없습니다</h2>
                <p>좋은 트윗을 알리고 싶다면 리트윗을 눌러 표시를 해보세요.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <CircleLoader />
      )}
    </>
  );
};

export default ProfileReNweets;
