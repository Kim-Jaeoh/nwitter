import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import styled from "./SelectNoInfo.module.css";
import SelectMenuBtn from "../button/SelectMenuBtn";
import ProfileReNweets from "./ProfileReNweets";
import ProfileReNweetsReplies from "./ProfileReNweetsReplies";

const ProfileReNweetBox = ({ userObj, creatorInfo }) => {
  const location = useLocation();
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    if (location.pathname.includes("/renweets/")) {
      setSelected(1);
    } else if (location.pathname.includes("/renweetsreplies/")) {
      setSelected(2);
    }
  }, [location.pathname]);

  return (
    <>
      <div className={styled.container}>
        <div className={styled.main__container}>
          <nav className={styled.categoryList}>
            <SelectMenuBtn
              num={1}
              selected={selected}
              url={
                location.pathname.includes("/user/")
                  ? "/user/renweets/" + creatorInfo.email
                  : "/profile/renweets/" + creatorInfo.email
              }
              text={"트윗"}
            />
            <SelectMenuBtn
              num={2}
              selected={selected}
              url={
                location.pathname.includes("/user/")
                  ? "/user/renweetsreplies/" + creatorInfo.email
                  : "/profile/renweetsreplies/" + creatorInfo.email
              }
              text={"답글"}
            />
          </nav>
        </div>

        <Switch>
          <Route
            path={
              location.pathname.includes("/user/")
                ? "/user/renweets/" + creatorInfo.email
                : "/profile/renweets/" + creatorInfo.email
            }
          >
            <ProfileReNweets userObj={userObj} creatorInfo={creatorInfo} />
          </Route>
          <Route
            path={
              location.pathname.includes("/user/")
                ? "/user/renweetsreplies/" + creatorInfo.email
                : "/profile/renweetsreplies/" + creatorInfo.email
            }
          >
            <ProfileReNweetsReplies
              userObj={userObj}
              creatorInfo={creatorInfo}
            />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default ProfileReNweetBox;
