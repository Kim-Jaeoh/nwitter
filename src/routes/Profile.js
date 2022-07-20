import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
// import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";
import useNweetData from "../hook/useNweetData";

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

  // console.log(userObj.displayName);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      // await updateProfile(userObj, { // #방법 3
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
    }
    refreshUser();
    setNewDisplayName("");
    alert(`닉네임이 '${newDisplayName}'로 변경되었습니다.`);
    history.push("/");
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          className="formInput"
          type="text"
          value={newDisplayName}
          placeholder="Display name"
          onChange={onChange}
          autoFocus
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
