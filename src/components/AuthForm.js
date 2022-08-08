import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { authService, dbService } from "../fbase";
import noneProfile from "../image/noneProfile.jpg";
import { setCurrentUser, setLoginToken } from "../reducer/user";

const AuthForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
              displayName: user.email.split("@")[0],
              email: user.email,
              photoURL: noneProfile,
              uid: user.uid,
            });
            dispatch(setLoginToken("login"));
            dispatch(
              setCurrentUser({
                displayName: user.displayName,
                email: user.email,
                photoURL: noneProfile,
                uid: user.uid,
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
      setError(error.message);
      // setError(error.message.replace("Firebase: ", "")) 에러 메세지 변경
    }
  };

  const toggleAccount = () => setNewAccount(!newAccount);

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          className="authInput"
          onChange={onChange}
        />
        <input
          type="submit"
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
