import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import styled from "./SelectNoInfo.module.css";
import ProfileLikeNweets from "./ProfileLikeNweets";
import ProfileLikeReplies from "./ProfileLikeReplies";
import SelectMenuBtn from "../button/SelectMenuBtn";

const ProfileLikeBox = ({ userObj }) => {
  const location = useLocation();
  const uid = location.pathname.split("/")[3];
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
              url={
                location.pathname.includes("/user/")
                  ? "/user/likenweets/" + uid
                  : "/profile/likenweets/" + uid
              }
              text={"트윗"}
            />
            <SelectMenuBtn
              num={2}
              selected={selected}
              url={
                location.pathname.includes("/user/")
                  ? "/user/likereplies/" + uid
                  : "/profile/likereplies/" + uid
              }
              text={"답글"}
            />
          </nav>
        </div>

        <Switch>
          <Route
            path={
              location.pathname.includes("/user/")
                ? "/user/likenweets/" + uid
                : "/profile/likenweets/" + uid
            }
          >
            <ProfileLikeNweets userObj={userObj} />
          </Route>
          <Route
            path={
              location.pathname.includes("/user/")
                ? "/user/likereplies/" + uid
                : "/profile/likereplies/" + uid
            }
          >
            <ProfileLikeReplies userObj={userObj} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default ProfileLikeBox;
