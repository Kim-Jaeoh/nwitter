import styled from "../modal/NweetModal.module.css";
import Modal from "@mui/material/Modal";
import { GrClose } from "react-icons/gr";
import NweetFactory from "../nweet/NweetFactory";

export const NweetModal = ({
  nweetModal,
  userObj,
  setNweetModal,
  toggleNweetModal,
}) => {
  return (
    <Modal
      open={nweetModal}
      onClose={toggleNweetModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styled.container}>
        <div className={styled.topBox}>
          <div className={styled.close} onClick={toggleNweetModal}>
            <GrClose />
          </div>
        </div>
        <div className={styled.editInput__container}>
          <NweetFactory
            userObj={userObj}
            setNweetModal={setNweetModal}
            nweetModal={nweetModal}
          />
        </div>
      </div>
    </Modal>
  );
};
