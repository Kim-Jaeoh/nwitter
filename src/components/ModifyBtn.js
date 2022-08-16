import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { dbService, storageService } from "../fbase";
import styled from "./ModifyBtn.module.css";

const ModifyBtn = ({ newNweetAttachment, nweetObj, toggleEdit }) => {
  const dbRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const dbAttachmentRef = ref(storageService, newNweetAttachment);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure your want to delete this nweet?");
    if (ok === true) {
      // delete nweet
      await deleteDoc(dbRef); // 문서 삭제
      if (newNweetAttachment) {
        await deleteObject(dbAttachmentRef); // 이미지 삭제
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
export default ModifyBtn;
