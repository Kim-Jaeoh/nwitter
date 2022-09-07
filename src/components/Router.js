import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import LeftBar from "../routes/LeftBar";
import Profile from "../routes/Profile";
import RightBar from "../routes/RightBar";
import styled from "./App.module.css";
import NotFound from "../routes/NotFound";
import Explore from "../routes/Explore";
import Bookmark from "../routes/Bookmark";
import Notice from "../routes/Notice";
import { DetailNweet } from "./DetailNweet";

const AppRouters = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      <Switch>
        <>
          {isLoggedIn ? (
            <>
              <div className={styled.container}>
                <LeftBar userObj={userObj} />
                <div className={styled.center__container}>
                  <Route exact path="/">
                    <Home userObj={userObj} />
                  </Route>
                  <Route path="/explore">
                    <Explore userObj={userObj} />
                  </Route>
                  <Route path="/notice">
                    <Notice userObj={userObj} />
                  </Route>
                  <Route path="/bookmark">
                    <Bookmark userObj={userObj} />
                  </Route>
                  <Route exact path="/nweet/:id">
                    <DetailNweet userObj={userObj} />
                  </Route>
                  <Route path="/profile/:type/:id">
                    <Profile userObj={userObj} refreshUser={refreshUser} />
                  </Route>
                </div>
                <RightBar userObj={userObj} />
              </div>
            </>
          ) : (
            <>
              <Route path="/auth">
                <Auth />
              </Route>
              <Redirect from="*" to="/auth" />
            </>
          )}
        </>
      </Switch>
    </Router>
  );
};

export default AppRouters;
