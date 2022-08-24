import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import LeftBar from "../routes/LeftBar";
import Profile from "../routes/Profile";
import RightBar from "../routes/RightBar";
import Navigation from "./Navigation";
import styled from "./App.module.css";
import NotFound from "../routes/NotFound";
import Explore from "../routes/Explore";
import Bookmark from "../routes/Bookmark";
import Notice from "../routes/Notice";

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
                  <Route exact path="/" replace>
                    <Home userObj={userObj} />
                  </Route>
                  <Route path="/explore" component={Explore} />
                  <Route path="/notice" component={Notice} />
                  <Route path="/bookmark" component={Bookmark} />
                  <Route path="/profile/:type/:id">
                    <Profile userObj={userObj} refreshUser={refreshUser} />
                  </Route>
                </div>
                <RightBar userObj={userObj} />
              </div>
            </>
          ) : (
            <>
              <Route exact path="/" replace>
                <Auth />
              </Route>
            </>
          )}
        </>
      </Switch>
    </Router>
  );
};

export default AppRouters;
