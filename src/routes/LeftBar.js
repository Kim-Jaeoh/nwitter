import { AiOutlineHome, AiFillHome, AiOutlineTwitter } from "react-icons/ai";
// import { BiHash, BiBookmark } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsPerson, BsBookmark, BsBell, BsHash } from "react-icons/bs";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dbService } from "../fbase";
import noneProfile from "../image/noneProfile.jpg";
import styled from "./LeftBar.module.css";

const LeftBar = ({ userObj }) => {
  const [creatorInfo, setCreatorInfo] = useState({});

  if (userObj.displayName === null) {
    const name = userObj.email.split("@")[0];
    userObj.displayName = name;
  }

  // const currentUsers = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
    });
  }, [userObj]);

  return (
    <div className={styled.container}>
      <div className={styled.wrapper}>
        <div className={styled.leftBar__logo}>
          <Link to="/">
            <AiOutlineTwitter />
          </Link>
        </div>
        <nav className={styled.leftBar__container}>
          <ul>
            <li>
              <Link to="/">
                <div className={styled.leftBar__list}>
                  <AiFillHome />
                  <span>홈</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/">
                <div className={styled.leftBar__list}>
                  <BsHash />
                  <span>탐색하기</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/">
                <div className={styled.leftBar__list}>
                  <BsBell />
                  <span>알림</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/">
                <div className={styled.leftBar__list}>
                  <BsBookmark />
                  <span>북마크</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <div className={styled.leftBar__list}>
                  <BsPerson />
                  <span>프로필</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styled.leftBar__user}>
        <Link to="/">
          <div className={styled.leftBar__userInfo}>
            <div className={styled.userInfo__profile}>
              <img
                src={creatorInfo.photoURL ? creatorInfo.photoURL : noneProfile}
                alt="profileImg"
                className={styled.profile__image}
              />
            </div>
            <div className={styled.userInfo__name}>
              <p>{creatorInfo.displayName}</p>
              <p>@{creatorInfo.email.split(["@"], 1)}</p>
            </div>
            <div className={styled.userInfo__etc}>
              <FiMoreHorizontal />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LeftBar;
