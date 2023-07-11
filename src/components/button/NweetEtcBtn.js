import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { dbService, storageService } from "../../fbase";
import { setCurrentUser } from "../../reducer/user";
import styled from "./NweetEtcBtn.module.css";

const NweetEtcBtn = ({
  nweetAttachment,
  nweetObj,
  toggleEdit,
  setNweetEtc,
}) => {
  // nweets는 원글 정보
  // nweetObj는 답글 정보
  const currentUser = useSelector((state) => state.user.currentUser);
  const [nweets, setNweets] = useState([]);
  const [reNweets, setReNweets] = useState([]);
  const [replies, setReplies] = useState("");
  const dispatch = useDispatch();
  const dbRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const repliesRef = doc(dbService, "replies", `${nweetObj.id}`);
  const dbAttachmentRef = ref(storageService, nweetAttachment);

  // 원글의 답글 정보 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "nweets"));
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = userArray.filter((asd) =>
        asd?.replyId?.includes(nweetObj.id)
      );

      setNweets(filter[0]);
    });
  }, [nweetObj.id]);

  // 답글 정보 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "replies"));
    onSnapshot(q, (querySnapShot) => {
      const replyArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const parentNweet = replyArray.findIndex(
        (reply) => reply.parent === nweetObj.id
      );

      setReplies(replyArray[parentNweet]);
    });
  }, [currentUser, nweetObj.id]);

  // 리트윗 가져오기
  useEffect(() => {
    const q = query(collection(dbService, "reNweets"));

    onSnapshot(q, (snapshot) => {
      const reNweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filter = reNweetArray.findIndex(
        (asd) => asd.parentEmail === currentUser.email
      );

      setReNweets(reNweetArray[filter]);
    });
  }, [currentUser.email]);

  const onDeleteClick = async () => {
    const ok = window.confirm("트윗을 삭제할까요?");

    if (ok === true) {
      // 원글 삭제
      await deleteDoc(dbRef);

      // 원글 삭제 시 원글의 리트윗 삭제
      if (reNweets?.parent?.includes(nweetObj.id)) {
        const reNweetsRef = doc(dbService, "reNweets", reNweets?.id);
        await deleteDoc(reNweetsRef);
      }
      // 원글 삭제 시 답글 삭제
      if (replies?.parent?.includes(nweetObj.id)) {
        const dbRepliesRef = doc(dbService, "replies", replies.id);
        await deleteDoc(dbRepliesRef); // 리트윗 삭제
      }

      // 이미지 삭제
      if (nweetAttachment) {
        await deleteObject(dbAttachmentRef);
      }

      // 답글만 삭제
      if (nweets?.replyId?.includes(nweetObj.id)) {
        const copy = [...nweets.replyId];
        const filter = copy.filter((reply) => reply !== nweetObj.id);
        await updateDoc(doc(dbService, "nweets", nweets.id), {
          replyId: filter,
        });
        await deleteDoc(repliesRef); // 답글 삭제

        dispatch(
          setCurrentUser({
            ...currentUser,
            replyId: filter,
          })
        );
      }

      setNweetEtc && setNweetEtc(false);
    }
  };

  return (
    <div className={styled.container}>
      <div className={`${styled.btn} ${styled.updateBtn}`} onClick={toggleEdit}>
        <FiEdit />
        <p>수정하기</p>
      </div>
      <div
        className={`${styled.btn} ${styled.deleteBtn}`}
        onClick={onDeleteClick}
      >
        <FiTrash2 />
        <p>삭제하기</p>
      </div>
    </div>
  );
};
export default NweetEtcBtn;
