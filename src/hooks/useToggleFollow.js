import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dbService } from "../fbase";
import { setCurrentUser } from "../reducer/user";

export const useToggleFollow = (myInfo) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const toggleFollow = async (userInfo) => {
    if (myInfo.following?.includes(userInfo.email)) {
      const followCopyFilter = myInfo.following.filter(
        (email) => email !== userInfo.email
      );

      const followingAtCopyFilter = myInfo.followingAt.filter(
        (at) => !userInfo.followerAt.includes(at)
      );

      const followerCopyFilter = userInfo.follower.filter(
        (email) => email !== myInfo.email
      );

      const followerAtCopyFilter = userInfo.followerAt.filter(
        (at) => !currentUser.followingAt.includes(at)
      );

      await updateDoc(doc(dbService, "users", myInfo.email), {
        following: followCopyFilter,
        // followingAt: followingAtCopyFilter,
      });

      await updateDoc(doc(dbService, "users", userInfo.email), {
        follower: followerCopyFilter,
        followerAt: followerAtCopyFilter,
      });

      dispatch(
        setCurrentUser({
          ...currentUser,
          following: followCopyFilter,
          followingAt: followingAtCopyFilter,
        })
      );
    } else {
      const time = Date.now();
      const followCopy = [...myInfo.following, userInfo.email];
      const followingAtCopy = [...myInfo.followingAt, time];
      const followerCopy = [...userInfo.follower, myInfo.email];
      const followerAtCopy = [...userInfo.followerAt, time];

      await updateDoc(doc(dbService, "users", myInfo.email), {
        following: followCopy,
        // followingAt: followingAtCopy,
      });
      await updateDoc(doc(dbService, "users", userInfo.email), {
        follower: followerCopy,
        followerAt: followerAtCopy,
      });

      dispatch(
        setCurrentUser({
          ...currentUser,
          following: followCopy,
          followingAt: followingAtCopy,
        })
      );
    }
  };

  return toggleFollow;
};
