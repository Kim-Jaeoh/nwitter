import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dbService } from "../fbase";
import { setCurrentUser } from "../reducer/user";

export const useToggleReNweet = (reNweetsObj, nweetObj, userObj) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [reNweetsId, setReNweetsId] = useState({});
  const [reNweet, setReNweet] = useState(false);

  useEffect(() => {
    if (reNweetsObj) {
      const filter = reNweetsObj.filter((obj) => obj.parent === nweetObj.id);
      const index = filter.findIndex((obj) => obj?.email === userObj.email);
      setReNweetsId(filter[index]);
    } else {
      return;
    }
  }, [nweetObj?.id, reNweetsObj, userObj?.email]);

  const toggleReNweet = async () => {
    console.log("dd");
    // if (nweetObj.reNweet?.some((reNweet) => reNweet.email === userObj.email)) {
    //   setReNweet(false);
    //   const copy = [...nweetObj.reNweet];
    //   const filter = copy.filter((arr) => {
    //     return arr.some((el) => el.email !== userObj.email);
    //   });

    //   await updateDoc(doc(dbService, "nweets", nweetObj.id), {
    //     reNweet: filter,
    //   });

    //   const reNweetsRef = doc(dbService, "reNweets", reNweetsId.id);
    //   await deleteDoc(reNweetsRef); // 원글의 리트윗 삭제

    //   dispatch(
    //     setCurrentUser({
    //       ...currentUser,
    //       reNweet: filter,
    //     })
    //   );
    // } else {
    //   setReNweet(true);
    //   const reNweetCreator = {
    //     parentText: nweetObj.text,
    //     creatorId: userObj.uid,
    //     email: userObj.email,
    //     like: [],
    //     reNweetAt: Date.now(),
    //     parent: nweetObj.id || null,
    //     parentEmail: nweetObj.email || null,
    //   };
    //   await addDoc(collection(dbService, "reNweets"), reNweetCreator);

    //   const copy = [
    //     ...nweetObj.reNweet,
    //     { email: userObj.email, reNweetAt: Date.now() },
    //   ];
    //   await updateDoc(doc(dbService, "nweets", nweetObj.id), {
    //     reNweet: copy,
    //   });

    //   dispatch(
    //     setCurrentUser({
    //       ...currentUser,
    //       reNweet: copy,
    //     })
    //   );
    // }
  };
  return { reNweet, setReNweet, toggleReNweet };
};
