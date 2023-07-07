import { doc, updateDoc } from "firebase/firestore";
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
        (at) => !myInfo.followingAt.includes(at)
      );

      const updateMyInfo = () =>
        updateDoc(doc(dbService, "users", myInfo.email), {
          followingAt: followingAtCopyFilter,
          following: followCopyFilter,
        });

      const updateUserInfo = () =>
        updateDoc(doc(dbService, "users", userInfo.email), {
          follower: followerCopyFilter,
          followerAt: followerAtCopyFilter,
        });

      await Promise.all([updateMyInfo(), updateUserInfo()]).then(() => {
        dispatch(
          setCurrentUser({
            ...currentUser,
            following: followCopyFilter,
            followingAt: followingAtCopyFilter,
          })
        );
      });
    } else {
      const time = Date.now();
      const followCopy = [...myInfo.following, userInfo.email];
      const followingAtCopy = [...myInfo.followingAt, time];
      const followerCopy = [...userInfo.follower, myInfo.email];
      const followerAtCopy = [...userInfo.followerAt, time];

      const updateMyInfo = () =>
        updateDoc(doc(dbService, "users", myInfo.email), {
          followingAt: followingAtCopy,
          following: followCopy,
        });
      const updateUserInfo = () =>
        updateDoc(doc(dbService, "users", userInfo.email), {
          follower: followerCopy,
          followerAt: followerAtCopy,
        });

      await Promise.all([updateMyInfo(), updateUserInfo()]).then(() => {
        dispatch(
          setCurrentUser({
            ...currentUser,
            following: followCopy,
            followingAt: followingAtCopy,
          })
        );
      });
    }
  };

  return toggleFollow;
};
