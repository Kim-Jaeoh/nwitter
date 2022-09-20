import React from "react";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { authService, dbService } from "../fbase";
import noneProfile from "../image/noneProfile.jpg";
import bgimg from "../image/bgimg.jpg";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setCurrentUser, setLoginToken } from "../reducer/user";
import styled from "../routes/Auth.module.css";
import { AiFillGithub } from "react-icons/ai";

export const GithubBtn = ({ newAccount }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSocialClick = async (e) => {
    let provider;
    let user;
    provider = new GithubAuthProvider();
    try {
      await signInWithPopup(authService, provider).then(async (result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        user = result.user;

        const docRef = doc(dbService, "users", user.email);
        await getDoc(docRef).then(async (docSnap) => {
          if (docSnap.exists()) {
            dispatch(setLoginToken("login"));
            dispatch(
              setCurrentUser({
                ...docSnap.data(),
                // bookmark: docSnap.data().bookmark
                //   ? docSnap.data().bookmark
                //   : [],
                // followAt: docSnap.data().followAt
                //   ? docSnap.data().followAt
                //   : [],
                // follower: docSnap.data().follower
                //   ? docSnap.data().follower
                //   : [],
                // following: docSnap.data().following
                //   ? docSnap.data().following
                //   : [],
                // reNweet: docSnap.data().reNweet ? docSnap.data().reNweet : [],
                // reNweetAt: docSnap.data().reNweetAt
                //   ? docSnap.data().reNweetAt
                //   : [],
              })
            );
          } else {
            const usersRef = collection(dbService, "users");
            await setDoc(doc(usersRef, user.email), {
              uid: user.uid,
              displayName: user.email.split("@")[0],
              email: user.email,
              photoURL: noneProfile,
              createdAtId: Date.now(),
              description: "",
              bgURL: bgimg,
              bookmark: [],
              followAt: [],
              follower: [],
              following: [],
              reNweet: [],
              token: token,
            });
            dispatch(setLoginToken("login"));
            dispatch(
              setCurrentUser({
                uid: user.uid,
                displayName: user.email.split("@")[0],
                email: user.email,
                photoURL: noneProfile,
                bgURL: bgimg,
                description: "",
                createdAtId: Date.now(),
                bookmark: [],
                followAt: [],
                follower: [],
                following: [],
                reNweet: [],
              })
            );
          }
        });
      });
      history.push("/");
    } catch (error) {
      console.log(error);
      alert("Google 로그인 오류");
    }
  };

  return (
    <button onClick={onSocialClick} name="github" className={styled.authBtn}>
      <AiFillGithub />
      {newAccount ? "Github로 로그인 하기" : "Github로 가입하기"}
    </button>
  );
};
