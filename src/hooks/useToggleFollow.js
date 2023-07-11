import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { dbService } from "../fbase";
import { setCurrentUser } from "../reducer/user";

export const useToggleFollow = (myInfo) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const toggleFollow = async (userInfo) => {
    if (myInfo.following?.some((follow) => follow.email === userInfo.email)) {
      const followCopyFilter = myInfo.following.filter(
        (follow) => follow.email !== userInfo.email
      );

      const followerCopyFilter = userInfo.follower.filter(
        (follow) => follow.email !== myInfo.email
      );

      const updateMyInfo = () =>
        updateDoc(doc(dbService, "users", myInfo.email), {
          following: followCopyFilter,
        });

      const updateUserInfo = () =>
        updateDoc(doc(dbService, "users", userInfo.email), {
          follower: followerCopyFilter,
        });

      await Promise.all([updateMyInfo(), updateUserInfo()]).then(() => {
        dispatch(
          setCurrentUser({
            ...currentUser,
            following: followCopyFilter,
          })
        );
      });
    } else {
      const time = Date.now();

      const updateMyInfo = () =>
        updateDoc(doc(dbService, "users", myInfo.email), {
          following: [
            ...myInfo.following,
            { email: userInfo.email, followAt: time },
          ],
        });
      const updateUserInfo = () =>
        updateDoc(doc(dbService, "users", userInfo.email), {
          follower: [
            ...userInfo.follower,
            { email: myInfo.email, followAt: time },
          ],
        });

      await Promise.all([updateMyInfo(), updateUserInfo()]).then(() => {
        dispatch(
          setCurrentUser({
            ...currentUser,
            following: [
              ...myInfo.following,
              { email: userInfo.email, followAt: time },
            ],
          })
        );
      });
    }
  };

  return toggleFollow;
};
