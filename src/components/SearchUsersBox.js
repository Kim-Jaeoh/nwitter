import { useState } from "react";
import { useEffect } from "react";
import styled from "./SearchNweetsBox.module.css";

const SearchUsersBox = ({ user, userResult }) => {
  return (
    <>
      {userResult.map((user) => (
        <div key={user.id} className={styled.follow__user}>
          <div className={styled.follow__userInfo}>
            <img
              src={user.photoURL}
              alt="프로필 이미지"
              className={styled.follow__image}
            />
            <div className={styled.follow__name}>
              <p>{user.displayName}</p>
              <p>@{user.email.split("@")[0]}</p>
              {user.description && <p>{user.description}</p>}
            </div>
          </div>
        </div>
      ))}
    </>
  );

  // return (
  //   <div
  //     // key={user.id}
  //     className={styled.follow__user}
  //   >
  //     <div className={styled.follow__userInfo}>
  //       <img
  //         src={user.photoURL}
  //         alt="프로필 이미지"
  //         className={styled.follow__image}
  //       />
  //       <div className={styled.follow__name}>
  //         <p>{user.displayName}</p>
  //         <p>@{user.email.split("@")[0]}</p>
  //         {user.description && <p>{user.description}</p>}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default SearchUsersBox;
