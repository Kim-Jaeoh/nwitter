import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { authService, dbService } from "../fbase";
import noneProfile from "../image/noneProfile.jpg";
import bgimg from "../image/bgimg.jpg";
import { setCurrentUser, setLoginToken } from "../reducer/user";
import styled from "./AuthForm.module.css";

const AuthForm = ({ newAccount }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [select, setSelect] = useState("");

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let user;
      if (newAccount) {
        // create account
        await createUserWithEmailAndPassword(authService, email, password).then(
          async (result) => {
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
              // bookmark: [],
              // follower: [],
              // following: [],
              // rejweet: [],
            });
            dispatch(setLoginToken("login"));
            dispatch(
              setCurrentUser({
                uid: user.uid,
                displayName: user.email.split("@")[0],
                email: user.email,
                photoURL: noneProfile,
                createdAtId: Date.now(),
                description: "",
                bgURL: bgimg,
                // bookmark: [],
                // follower: [],
                // following: [],
                // rejweet: [],
              })
            );
          }
        );
        // const userRef = collection(dbService, "users");
      } else {
        // log in
        await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (error) {
      if (error.message.includes("(auth/email-already-in-use).")) {
        setError(
          error.message.replace(
            "Firebase: Error (auth/email-already-in-use).",
            "이미 가입이 되어있는 이메일입니다."
          )
        );
      } else if (error.message.includes("(auth/weak-password)")) {
        setError(
          error.message.replace(
            "Firebase: Password should be at least 6 characters (auth/weak-password).",
            "비밀번호를 최소 6글자 이상 입력해주세요."
          )
        );
      } else if (error.message.includes("(auth/wrong-password).")) {
        setError(
          error.message.replace(
            "Firebase: Error (auth/wrong-password).",
            "이메일이나 비밀번호가 틀립니다."
          )
        );
      } else if (error.message.includes("(auth/too-many-requests)")) {
        setError(
          error.message.replace(
            "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).",
            "로그인 시도가 여러 번 실패하여 이 계정에 대한 액세스가 일시적으로 비활성화되었습니다. 비밀번호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다."
          )
        );
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className={styled.container}>
      <form onSubmit={onSubmit} className={styled.wrapper}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className={`${styled.authInput} ${
            select === "email" && styled.select
          }`}
          onFocus={() => setSelect("email")}
          onBlur={() => setSelect("")}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          className={`${styled.authInput} ${
            select === "password" && styled.select
          }`}
          onChange={onChange}
          onFocus={() => setSelect("password")}
          onBlur={() => setSelect("")}
        />
        <input
          type="submit"
          className={`${styled.authInput} ${styled.authSubmit}`}
          value={newAccount ? "가입하기" : "로그인 하기"}
        />
        {error && <span className={styled.authError}>{error}</span>}
      </form>
    </div>
  );
};

export default AuthForm;
