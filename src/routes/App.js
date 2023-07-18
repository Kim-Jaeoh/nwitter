import { useEffect, useState } from "react";
import AppRouters from "./Router";
import { authService } from "../fbase";
import { AiOutlineTwitter } from "react-icons/ai";
import styled from "./App.module.css";

const App = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 유저 상태 변화 추적(로그인, 로그아웃, 어플리케이션 초기화 시)
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouters isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        <div className={styled.render__loading}>
          <AiOutlineTwitter className={styled.render__logo} />
        </div>
      )}
    </>
  );
};

export default App;
