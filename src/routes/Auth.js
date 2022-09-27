import { useState } from "react";
import { authService, dbService } from "../fbase";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import AuthForm from "../components/auth/AuthForm";
import { AiOutlineTwitter } from "react-icons/ai";
import styled from "./Auth.module.css";
import authBg from "../image/background.jpg";
import noneProfile from "../image/noneProfile.jpg";
import bgimg from "../image/bgimg.jpg";
import { collection, doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLoginToken } from "../reducer/user";
import { useHistory } from "react-router-dom";
import { GoogleBtn } from "../components/button/GoogleBtn";
import { GithubBtn } from "../components/button/GithubBtn";

const Auth = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [newAccount, setNewAccount] = useState(true);

  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    let user;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
      } else if (name === "github") {
        provider = new GithubAuthProvider();
      }
      await signInWithPopup(authService, provider).then(async (result) => {
        user = result.user;
        console.log(user);
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
      });
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAccount = () => setNewAccount(!newAccount);

  return (
    <div className={styled.container}>
      <div className={styled.authImage}>
        <img src={authBg} alt="auth bg" />
      </div>
      <div className={styled.auth}>
        <div className={styled.nwitter__logo}>
          <AiOutlineTwitter />
        </div>
        <div className={styled.nwitter__notice}>
          <span>지금 일어나고 있는 일</span>
        </div>
        {newAccount ? (
          <div className={styled.nwitter__info}>
            <span>Nwitter 로그인하기</span>
          </div>
        ) : (
          <div className={styled.nwitter__info}>
            <span>오늘 Nwitter에 가입하세요.</span>
          </div>
        )}
        <AuthForm newAccount={newAccount} />
        <div className={styled.authBtns}>
          <GoogleBtn newAccount={newAccount} />
          <GithubBtn newAccount={newAccount} />
        </div>
        {newAccount ? (
          <div className={styled.auth__notice}>
            <span>계정이 없으신가요?</span>
            <div>
              <span onClick={toggleAccount} className={styled.authSwitch}>
                가입
              </span>
              <span>하기</span>
            </div>
          </div>
        ) : (
          <div className={styled.auth__notice}>
            <span>이미 Nwitter에 가입하셨나요?</span>
            <div>
              <span onClick={toggleAccount} className={styled.authSwitch}>
                로그인
              </span>
              <span>하기</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
