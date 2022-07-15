import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  // // 필터링 방법 (본인이 작성한 것 확인)
  // const getMyNweets = async () => {
  //   const q = query(
  //     collection(dbService, "nweets"),
  //     where("creatorId", "==", userObj.uid),
  //     orderBy("createdAt", "desc")
  //   );

  //   // 위와 같은 방식
  //   // const querySnapshot = await getDocs(collection(dbService, "nweets"),
  //   //   where("creatorId", "==", userObj.uid),
  //   //   orderBy("createdAt", "desc")
  //   // );

  //   const querySnapshot = await getDocs(q);

  //   console.log(querySnapshot.docs.map((doc) => doc.data()));

  //   // forEach은 return 값(반환값)이 없다
  //   // querySnapshot.forEach((doc) => {
  //   //   console.log(doc.id, "HI", doc.data());
  //   // });
  // };

  // useEffect(() => {
  //   getMyNweets();
  // }, []);

  // //

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
    }
    refreshUser();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newDisplayName}
          placeholder="Display name"
          onChange={onChange}
        />
        <input type="submit" value="update profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
