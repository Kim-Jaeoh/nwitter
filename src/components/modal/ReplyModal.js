import styled from "../modal/NweetModal.module.css";
import Modal from "@mui/material/Modal";
import { GrClose } from "react-icons/gr";
import { DetailReplyForm } from "../detail/DetailReplyForm";
import { useSelector } from "react-redux";
import BarLoader from "../loader/BarLoader";

export const ReplyModal = ({
  loading,
  userObj,
  nweetObj,
  creatorInfo,
  replyModal,
  setReplyModal,
}) => {
  const currentProgressBar = useSelector((state) => state.user.load);

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
          {currentProgressBar?.load && replyModal && <BarLoader />}
          <DetailReplyForm
            userObj={userObj}
            creatorInfo={creatorInfo}
            nweetObj={nweetObj}
            setReplyModal={setReplyModal}
            replyModal={replyModal}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};
