import styled from "../modal/NweetModal.module.css";
import Modal from "@mui/material/Modal";
import { GrClose } from "react-icons/gr";
import NweetFactory from "../nweet/NweetFactory";
import { DetailReplyForm } from "../detail/DetailReplyForm";

export const ReplyModal = ({
  loading,
  userObj,
  nweetObj,
  creatorInfo,
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
            creatorInfo={creatorInfo}
            nweets={nweetObj}
            setReplyModal={setReplyModal}
            replyModal={replyModal}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};
