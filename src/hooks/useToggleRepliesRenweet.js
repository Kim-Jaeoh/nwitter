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

export const useToggleRepliesRenweet = (reNweetsObj, nweetObj, userObj) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [reNweetsId, setReNweetsId] = useState({});
  const [replyReNweetsId, setReplyReNweetsId] = useState({});
  const [reNweet, setReNweet] = useState(false);
  const [time, setTime] = useState(Date.now());

  // map 처리 된 리트윗 정보들 중 본인 ID와 같은 index 정보들만 필터링
  useEffect(() => {
    const filter = reNweetsObj.filter((obj) => obj.parent === nweetObj.id);
    const index = filter.findIndex((obj) => obj?.email === userObj.email);

    setReNweetsId(filter[index]);

    const index2 = reNweetsObj?.findIndex(
      (obj) => obj?.parent === nweetObj.parent
    );
    setReplyReNweetsId(reNweetsObj[index2]);
  }, [nweetObj.id, nweetObj.parent, reNweetsObj, userObj.email]);

  const toggleReNweet = async () => {
    const copy = [...nweetObj.reNweet];
    const filter = copy.filter((email) => {
      return email !== userObj.email;
    });

    if (nweetObj.reNweet?.includes(userObj.email)) {
      if (!nweetObj?.isReply) {
        setReNweet(false);

        await updateDoc(doc(dbService, "nweets", nweetObj.id), {
          reNweet: filter,
        });

        const reNweetsRef = doc(dbService, "reNweets", reNweetsId.id);
        await deleteDoc(reNweetsRef); // 원글의 리트윗 삭제
        dispatch(
          setCurrentUser({
            ...currentUser,
            reNweet: filter,
          })
        );
      } else {
        setReNweet(false);
        await updateDoc(doc(dbService, "replies", nweetObj.id), {
          reNweet: filter,
        });

        const replyReNweetsRef = doc(dbService, "reNweets", replyReNweetsId.id);
        await deleteDoc(replyReNweetsRef); // 답글의 리트윗 삭제
        dispatch(
          setCurrentUser({
            ...currentUser,
            reNweet: filter,
          })
        );
      }
    } else {
      setReNweet(true);
      const _nweetReply = {
        text: nweetObj.text,
        creatorId: userObj.uid,
        email: userObj.email,
        like: [],
        // reNweet: [],
        reNweetAt: time,
        parent: nweetObj.parent || null,
        parentEmail: nweetObj.parentEmail || null,
        replyId: nweetObj.id || null,
        replyEmail: nweetObj.email || null,
      };
      await addDoc(collection(dbService, "reNweets"), _nweetReply);

      const copy = [...nweetObj.reNweet, userObj.email];

      if (!nweetObj?.isReply) {
        await updateDoc(doc(dbService, "nweets", nweetObj.id), {
          reNweet: copy,
        });
      } else {
        await updateDoc(doc(dbService, "replies", nweetObj.id), {
          reNweet: copy,
        });
      }

      dispatch(
        setCurrentUser({
          ...currentUser,
          reNweet: copy,
        })
      );
    }
  };

  return { reNweet, setReNweet, toggleReNweet };
};
