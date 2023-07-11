import styled from "../modal/NweetModal.module.css";
import Modal from "@mui/material/Modal";
import { GrClose } from "react-icons/gr";
import { DetailReplyForm } from "../detail/DetailReplyForm";

export const ReplyModal = ({
  userObj,
  nweetObj,
  replyModal,
  setReplyModal,
}) => {
  return (
    <Modal
      open={replyModal}
      onClose={() => setReplyModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <div className={styled.topBox}>
          <div className={styled.close} onClick={() => setReplyModal(false)}>
            <GrClose />
          </div>
        </div>
        <div className={styled.editInput__container}>
          <DetailReplyForm
            userObj={userObj}
            nweetObj={nweetObj}
            replyModal={replyModal}
            setReplyModal={setReplyModal}
          />
        </div>
      </div>
    </Modal>
  );
};
