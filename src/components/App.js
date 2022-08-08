import { useEffect, useState } from "react";
import AppRouters from "./Router";
import { authService } from "../fbase";
import { AiOutlineTwitter } from "react-icons/ai";
import styled from "./App.module.css";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // const [newName, setNewName] = useState(false); // #방법 3

  useEffect(() => {
    // 유저 상태 변화 추적(로그인, 로그아웃, 어플리케이션 초기화 시)
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        // userObj 간소화
        // setUserObj({
        //   displayName: user.displayName,
        //   uid: user.uid,
        // });
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true); // 어플리케이션이 언제 시작해도 onAuthStateChanged가 실행돼야 하기 때문에 true
    });
  }, []);

  const refreshUser = async () => {
    const user = authService.currentUser;
    // #방법 1
    //   setUserObj({
    //     displayName: user.displayName,
    //     uid: user.uid,
    //   });

    // #방법 2
    setUserObj({ ...user });

    // #방법 3 (profile.js에서 userObj 사용 가능)
    // setNewName(user.displayName); // (useState 생성 후 props 전달)

    // #방법 4
    // setNewName((prev) => !prev);
  };

  return (
    <>
      {init ? (
        <AppRouters
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          // newName={newName} // #방법 3
        />
      ) : (
        <div className={styled.render__loading}>
          <AiOutlineTwitter className={styled.render__logo} />
        </div>
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;

/* 
  버전 업이 되면서 지금은 Auth객체의 CurrentUser속성이 내부적으로는 UserImpl라는 클래스를 상속받아 생성된 것이기에 위 방식(setUserObj(user))대로 객체를 복사하면 UserImpl라는 부모 클래스의 메소드를 복사하지 못해 처음 한번만 update가 되고 두번째 업데이트 부터는 getIdToken 함수를 찾을 수 없다는 에러가 나오게 됩니다.
  원인은 아마 객체를 복사할 때 Auth 객체의 Currentuser 객체 속의 private 속성은 복사가 안되고 일반 Object 클래스를 상속받아 복사가 이루어 지면서 getIdToken 함수를 찾을 수 없게 되는 걸로 추측하고 있습니다.
*/
