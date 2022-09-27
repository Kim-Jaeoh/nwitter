import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { dbService } from "../fbase";
import { setCurrentUser } from "../reducer/user";

export const useToggleFollow = (myInfo) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const toggleFollow = async (userInfo) => {
    if (myInfo.following?.includes(userInfo.email)) {
      const followCopy = [...myInfo.following];
      const followCopyFilter = followCopy.filter(
        (email) => email !== userInfo.email
      );

      const followAtCopy = [...myInfo.followAt];
      const followAtCopyFilter = followAtCopy.filter(
        (at) => !userInfo.followAt.includes(at)
      );

      const followerCopy = [...userInfo.follower];
      const followerCopyFilter = followerCopy.filter(
        (email) => email !== myInfo.email
      );

      const followerAtCopy = [...userInfo.followAt];
      const followerAtCopyFilter = followerAtCopy.filter(
        (at) => !myInfo.followAt.includes(at)
      );

      await updateDoc(doc(dbService, "users", myInfo.email), {
        following: followCopyFilter,
        followAt: followAtCopyFilter,
      });
      await updateDoc(doc(dbService, "users", userInfo.email), {
        follower: followerCopyFilter,
        followAt: followerAtCopyFilter,
      });
      dispatch(
        setCurrentUser({
          ...currentUser,
          following: myInfo.following,
          follower: myInfo.follower,
          followAt: myInfo.followAt,
        })
      );
    } else {
      const time = Date.now();
      const followCopy = [...myInfo.following, userInfo.email];
      const followAtCopy = [...myInfo.followAt, time];
      const followerCopy = [...userInfo.follower, myInfo.email];
      const followerAtCopy = [...userInfo.followAt, time];

      await updateDoc(doc(dbService, "users", myInfo.email), {
        following: followCopy,
        followAt: followAtCopy,
      });
      await updateDoc(doc(dbService, "users", userInfo.email), {
        follower: followerCopy,
        followAt: followerAtCopy,
      });

      dispatch(
        setCurrentUser({
          ...currentUser,
          following: myInfo.following,
          follower: myInfo.follower,
          followAt: myInfo.followAt,
        })
      );
    }
  };

  return toggleFollow;
};
