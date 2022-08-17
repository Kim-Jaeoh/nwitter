import { AiOutlineHome, AiFillHome, AiOutlineTwitter } from "react-icons/ai";
// import { BiHash, BiBookmark } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsPerson, BsBookmark, BsBell, BsHash } from "react-icons/bs";
import { FaFeatherAlt } from "react-icons/fa";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dbService } from "../fbase";
import noneProfile from "../image/noneProfile.jpg";
import styled from "./LeftBar.module.css";

const LeftBar = ({ userObj }) => {
  const [creatorInfo, setCreatorInfo] = useState({});

  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
    });
  }, [userObj]);

  // if (creatorInfo.email) {
  //   const email = creatorInfo.email.split("@")[0];
  //   creatorInfo.email = email;
  // }

  return (
    <article className={styled.container}>
      <section className={styled.wrapper}>
        <section className={styled.leftBar__category}>
          <div className={styled.leftBar__logobox}>
            <div className={styled.leftBar__logo}>
              <Link to="/">
                <AiOutlineTwitter />
              </Link>
            </div>
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
                    {/* <div
                      className={`${styled.userInfo__profile__hidden} ${styled.userInfo__profile__block}`}
                    >
                      <img
                        src={
                          creatorInfo.photoURL
                            ? creatorInfo.photoURL
                            : noneProfile
                        }
                        alt="profileImg"
                        className={styled.profile__image}
                      />
                    </div> */}
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          <section className={styled.leftBar__nweet}>
            <div>
              <span>트윗하기</span>
              <FaFeatherAlt />
            </div>
          </section>
        </section>
        <section className={styled.leftBar__user}>
          <Link to="/">
            <div className={styled.leftBar__userInfo}>
              <div className={styled.userInfo__profile}>
                <img
                  src={
                    creatorInfo.photoURL ? creatorInfo.photoURL : noneProfile
                  }
                  alt="profileImg"
                  className={styled.profile__image}
                />
              </div>
              <div className={styled.userInfo__name}>
                <p>{creatorInfo.displayName}</p>
                <p>@{userObj.email.split("@")[0]}</p>
              </div>
              <div className={styled.userInfo__etc}>
                <FiMoreHorizontal />
              </div>
            </div>
          </Link>
        </section>
      </section>
    </article>
  );
};

export default LeftBar;
