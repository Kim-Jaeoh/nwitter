import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import styled from "./SelectNoInfo.module.css";
import ProfileLikeNweets from "./ProfileLikeNweets";
import ProfileLikeReplies from "./ProfileLikeReplies";
import SelectMenuBtn from "../button/SelectMenuBtn";
import CircleLoader from "../loader/CircleLoader";

const ProfileLike = ({ userObj, loading }) => {
  const location = useLocation();
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    if (location.pathname.includes("likenweets")) {
      setSelected(1);
    } else if (location.pathname.includes("likereplies")) {
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
              url={"/profile/likenweets/" + userObj.email}
              text={"트윗"}
            />
            <SelectMenuBtn
              num={2}
              selected={selected}
              url={"/profile/likereplies/" + userObj.email}
              text={"답글"}
            />
          </nav>
        </div>

        {loading ? (
          <Switch>
            <Route path={"/profile/likenweets/" + userObj.email}>
              <ProfileLikeNweets userObj={userObj} />
            </Route>
            <Route path={"/profile/likereplies/" + userObj.email}>
              <ProfileLikeReplies userObj={userObj} />
            </Route>
          </Switch>
        ) : (
          <CircleLoader />
        )}
      </div>
    </>
  );
};

export default ProfileLike;
