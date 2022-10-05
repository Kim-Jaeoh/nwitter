import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
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
        // redux store에서 currentUser 데이터 불러와서 필드값 삭제하기
        // (문서에 있는 following은 getDocs()로 인해 업데이트 반영이 안 되었기 때문에 삭제가 안 됨
        (at) => !myInfo.followingAt.includes(at)
      );

      await updateDoc(doc(dbService, "users", myInfo.email), {
        // getDocs()로 할 때 업데이트가 반영이 안 되어 언팔로우 시 필드 삭제가 안 됨
        followingAt: followingAtCopyFilter,
        following: followCopyFilter,
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
          // followerAt: followerAtCopyFilter,
        })
      );
    } else {
      const time = Date.now();
      const followCopy = [...myInfo.following, userInfo.email];
      const followingAtCopy = [...myInfo.followingAt, time];
      const followerCopy = [...userInfo.follower, myInfo.email];
      const followerAtCopy = [...userInfo.followerAt, time];

      await updateDoc(doc(dbService, "users", myInfo.email), {
        // getDocs()로 할 때 업데이트가 반영이 안 되어 언팔로우 시 필드 삭제가 안 됨
        followingAt: followingAtCopy,
        following: followCopy,
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
          // followerAt: followerAtCopy,
        })
      );
    }
  };

  return toggleFollow;
};
