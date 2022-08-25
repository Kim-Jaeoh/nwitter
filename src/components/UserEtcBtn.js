import { useHistory } from "react-router-dom";
import { authService } from "../fbase";
import { setCurrentUser, setLoginToken } from "../reducer/user";
import styled from "./UserEtcBtn.module.css";
import { useDispatch } from "react-redux";
import { BiCheck } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import { GoTriangleDown } from "react-icons/go";

const UserEtcBtn = ({ creatorInfo }) => {
  const dispatch = useDispatch;
  const history = useHistory();

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃 하시겠어요?");
    if (ok) {
      authService.signOut();
      dispatch(setLoginToken("logout"));
      dispatch(
        setCurrentUser({
          photoURL: "",
          uid: "",
          displayName: "",
          email: "",
          description: "",
          bgURL: "",
          // bookmark: [],
          // follower: [],
          // following: [],
          // rejweet: [],
        })
      );
      history.push("/");
    }
  };

  return (
    <div className={styled.container__box}>
      <div className={styled.container}>
        <div className={`${styled.btn} ${styled.updateBtn}`}>
          <div className={styled.leftBar__userInfo}>
            <div className={styled.userInfo__profile}>
              <img
                // src={creatorInfo.photoURL ? creatorInfo.photoURL : noneProfile}
                src={creatorInfo.photoURL}
                alt="profileImg"
                className={styled.profile__image}
              />
            </div>
            <div className={styled.userInfo__name}>
              <p>{creatorInfo.displayName}</p>
              <p>@{creatorInfo.email.split("@")[0]}</p>
            </div>
            <div className={styled.userInfo__etc}>
              <BiCheck />
            </div>
          </div>
        </div>
        <div
          className={`${styled.btn} ${styled.deleteBtn}`}
          onClick={onLogOutClick}
        >
          <div className={styled.userInfo__etc}>
            <IoMdExit />
          </div>
          <p>로그아웃</p>
        </div>
      </div>
      <div className={styled.box__triangle}>
        <GoTriangleDown />
      </div>
    </div>
  );
};
export default UserEtcBtn;
