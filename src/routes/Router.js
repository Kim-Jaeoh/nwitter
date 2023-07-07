import React from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Auth from "./Auth";
import Home from "./Home";
import LeftBar from "./LeftBar";
import Profile from "./Profile";
import RightBar from "./RightBar";
import styled from "./App.module.css";
import Explore from "./Explore";
import Bookmark from "./Bookmark";
import Notice from "./Notice";
import { DetailNweet } from "../components/detail/DetailNweet";
import TopButton from "../components/button/TopButton";

const AppRouters = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      <Switch>
        <>
          <TopButton />

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
                    <Profile userObj={userObj} />
                  </Route>
                  <Route path="/user/:type/:id">
                    <Profile userObj={userObj} />
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
