import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { dbService, storageService } from "../fbase";
import { setCurrentUser } from "../reducer/user";
import styled from "./NweetEtcBtn.module.css";

const NweetEtcBtn = ({ newNweetAttachment, nweetObj, toggleEdit }) => {
  // nweets는 원글 정보
  // nweetObj는 답글 정보

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [nweets, setNweets] = useState([]);
  const dbRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const repliesRef = doc(dbService, "replies", `${nweetObj.id}`);
  const dbAttachmentRef = ref(storageService, newNweetAttachment);
  // const [loading, setLoading] = useState(false);

  // 원글 정보 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("reply", "array-contains", nweetObj.id)
    );
    onSnapshot(q, (querySnapShot) => {
      const userArray = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // setLoading(true);

      setNweets(userArray[0]);
    });
    // return () => {
    //   setLoading(false);
    // };
  }, [nweetObj.id]);

  const onDeleteClick = async () => {
    const ok = window.confirm("트윗을 삭제할까요?");
    if (ok === true) {
      await deleteDoc(dbRef); // 원글 삭제

      if (newNweetAttachment) {
        await deleteObject(dbAttachmentRef); // 이미지 삭제
      }

      if (nweets?.reply?.includes(nweetObj.id)) {
        const copy = [...nweets.reply];
        const filter = copy.filter((reply) => reply !== nweetObj.id);
        await updateDoc(doc(dbService, "nweets", nweets.id), {
          reply: filter,
        });
        await deleteDoc(repliesRef); // 원글의 reply 삭제

        dispatch(
          setCurrentUser({
            ...currentUser,
            reply: filter,
          })
        );
      }
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
