import { useState } from "react";
import AuthForm from "../components/auth/AuthForm";
import { AiOutlineTwitter } from "react-icons/ai";
import styled from "./Auth.module.css";
import authBg from "../image/background.jpg";
import { GoogleBtn } from "../components/button/GoogleBtn";
import { GithubBtn } from "../components/button/GithubBtn";

const Auth = () => {
  const [newAccount, setNewAccount] = useState(true);

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
