import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { Route, Switch, useLocation } from "react-router-dom";
import { BookmarkNweets } from "../components/bookMark/BookmarkNweets";
import { BookmarkReplies } from "../components/bookMark/BookmarkReplies";
import SelectMenuBtn from "../components/button/SelectMenuBtn";
import CircleLoader from "../components/loader/CircleLoader";
import { TopCategory } from "../components/topCategory/TopCategory";
import { dbService } from "../fbase";
import styled from "./Bookmark.module.css";

const Bookmark = ({ userObj }) => {
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    if (location.pathname.includes("nweets")) {
      setSelected(1);
    } else if (location.pathname.includes("replies")) {
      setSelected(2);
    }
  }, [location.pathname]);

  // 본인 정보 가져오기
  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [userObj.email]);

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
        {uid !== userObj.email && (
          <TopCategory
            text={"북마크"}
            iconName={<IoArrowBackOutline />}
            creatorInfo={creatorInfo}
          />
        )}
        <div className={styled.main__container}>
          <nav className={styled.categoryList}>
            <SelectMenuBtn
              num={1}
              selected={selected}
              url={
                location.pathname.includes(userObj.email)
                  ? "/profile/bookmarknweets/" + userObj.email
                  : "/bookmark/nweets"
              }
              text={"트윗"}
            />
            <SelectMenuBtn
              num={2}
              selected={selected}
              url={
                location.pathname.includes(userObj.email)
                  ? "/profile/bookmarkreplies/" + userObj.email
                  : "/bookmark/replies"
              }
              text={"답글"}
            />
          </nav>
        </div>

        {loading ? (
          <Switch>
            <Route
              path={
                location.pathname.includes(userObj.email)
                  ? "/profile/bookmarknweets/" + userObj.email
                  : "/bookmark/nweets"
              }
            >
              <BookmarkNweets
                userObj={userObj}
                reNweetsObj={reNweets}
                creatorInfo={creatorInfo}
                loading={loading}
              />
            </Route>
            <Route
              path={
                location.pathname.includes(userObj.email)
                  ? "/profile/bookmarkreplies/" + userObj.email
                  : "/bookmark/replies"
              }
            >
              <BookmarkReplies
                userObj={userObj}
                reNweetsObj={reNweets}
                creatorInfo={creatorInfo}
                loading={loading}
              />
            </Route>
          </Switch>
        ) : (
          <CircleLoader />
        )}
      </div>
    </>
  );
};

export default Bookmark;
