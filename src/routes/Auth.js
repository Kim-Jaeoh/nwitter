import { useState } from "react";
import { authService } from "../fbase";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import AuthForm from "../components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { AiOutlineTwitter } from "react-icons/ai";
import styled from "./Auth.module.css";
import authBg from "../image/background.jpg";

const Auth = () => {
  const [newAccount, setNewAccount] = useState(true);

  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
      } else if (name === "github") {
        provider = new GithubAuthProvider();
      }
      await signInWithPopup(authService, provider);
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
            <span>오늘 Nwitter에 가입하세요.</span>
          </div>
        ) : (
          <div className={styled.nwitter__info}>
            <span>Nwitter 로그인하기</span>
          </div>
        )}
        <AuthForm newAccount={newAccount} />
        <div className={styled.authBtns}>
          <button
            onClick={onSocialClick}
            name="google"
            className={styled.authBtn}
          >
            <FontAwesomeIcon icon={faGoogle} />
            {newAccount ? "Google로 가입하기" : "Google로 로그인 하기"}
          </button>
          <button
            onClick={onSocialClick}
            name="github"
            className={styled.authBtn}
          >
            <FontAwesomeIcon icon={faGithub} />
            {newAccount ? "Github로 가입하기" : "Github로 로그인 하기"}
          </button>
        </div>
        {newAccount ? (
          <div className={styled.auth__notice}>
            <span>이미 Nwitter에 가입하셨나요?</span>
            <div>
              <span onClick={toggleAccount} className={styled.authSwitch}>
                로그인
              </span>
              <span>하기</span>
            </div>
          </div>
        ) : (
          <div className={styled.auth__notice}>
            <span>계정이 없으신가요?</span>
            <div>
              <span onClick={toggleAccount} className={styled.authSwitch}>
                가입
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
