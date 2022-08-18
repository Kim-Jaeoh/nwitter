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

const AppRouters = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      {/* {isLoggedIn && <LeftBar userObj={userObj} />} */}
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
                  <Route exact path="/profile" replace>
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
      {/* {isLoggedIn && <RightBar userObj={userObj} />} */}
    </Router>
  );
};

export default AppRouters;
