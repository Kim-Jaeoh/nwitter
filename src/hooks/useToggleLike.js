import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useSelector } from "react-redux";
import { dbService } from "../fbase";

export const useToggleLike = (nweetObj) => {
  const [liked, setLiked] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const toggleLike = async () => {
    if (nweetObj.like?.includes(currentUser.email)) {
      setLiked(false);
      const copy = [...nweetObj.like];
      const filter = copy.filter((email) => email !== currentUser.email);

      // if (Object.keys(nweetObj).includes("parent") === false) {
      if (!nweetObj?.parent) {
        await updateDoc(doc(dbService, "nweets", nweetObj.id), {
          like: filter,
        });
      } else {
        await updateDoc(doc(dbService, "replies", nweetObj.id), {
          like: filter,
        });
      }
    } else {
      setLiked(true);
      const copy = [...nweetObj.like];
      copy.push(currentUser.email);

      // if (Object.keys(nweetObj).includes("parent") === false) {
      if (!nweetObj?.parent) {
        await updateDoc(doc(dbService, "nweets", nweetObj.id), {
          like: copy,
        });
      } else {
        await updateDoc(doc(dbService, "replies", nweetObj.id), {
          like: copy,
        });
      }
    }
  };

  return { liked, setLiked, toggleLike };
};
