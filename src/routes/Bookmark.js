import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useHistory, useLocation } from "react-router-dom";
import Nweet from "../components/Nweet";
import { TopCategory } from "../components/TopCategory";
import { dbService } from "../fbase";
import styled from "./Bookmark.module.css";

const Bookmark = ({ userObj }) => {
  const history = useHistory();
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [filterBookmark, setFilterBookmark] = useState([]);
  const [loading, setLoading] = useState(false);

  // 내 정보 가져오기
  const getMyInfo = useCallback(async () => {
    // 실시간
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
    });
  }, [userObj.email]);

  // 트윗 정보 가져오기
  useEffect(() => {
    // 실시간
    const q = query(collection(dbService, "nweets"));
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filter = userArray.filter((id) =>
        creatorInfo.bookmark?.includes(id.id)
      );
      setFilterBookmark(filter);
      setLoading(true);
    });
    // return () => setLoading(false);
  }, [creatorInfo.bookmark]);

  useEffect(() => {
    getMyInfo();
  }, [getMyInfo]);

  return (
    <>
      {loading && (
        <div className={styled.container}>
          {uid !== userObj.email && (
            <TopCategory
              text={"북마크"}
              iconName={<IoArrowBackOutline />}
              creatorInfo={creatorInfo}
            />
          )}
          {filterBookmark.length !== 0 ? (
            <div>
              {filterBookmark.map((myBook) => (
                <Nweet key={myBook.id} nweetObj={myBook} userObj={userObj} />
              ))}
            </div>
          ) : (
            <div className={styled.noInfoBox}>
              <div className={styled.noInfo}>
                {/* <img
                  src="https://abs.twimg.com/sticky/illustrations/empty-states/book-in-bird-cage-400x200.v1.png"
                  alt=""
                ></img> */}
                <h2>나중을 위해 트윗 저장하기</h2>
                <p>
                  좋은 트윗은 그냥 흘려 보내지 마세요. 나중에 다시 쉽게 찾을 수
                  있도록 북마크에 추가하세요.
                </p>
              </div>
            </div>
            // <Loading />
          )}
        </div>
      )}
    </>
  );
};

export default Bookmark;
