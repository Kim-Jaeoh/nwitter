import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AiOutlineHome, AiFillHome, AiTwotoneHome } from "react-icons/ai";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsPerson, BsBell, BsBellFill, BsPersonFill } from "react-icons/bs";
import { FaFeatherAlt, FaHashtag, FaTwitter } from "react-icons/fa";
import { FiHash } from "react-icons/fi";
import { doc, onSnapshot } from "firebase/firestore";
import { Link, useHistory, useLocation } from "react-router-dom";
import { authService, dbService } from "../fbase";
import noneProfile from "../image/noneProfile.jpg";
import styled from "./LeftBar.module.css";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import UserEtcBtn from "../components/UserEtcBtn";
import { setCurrentUser, setLoginToken } from "../reducer/user";

const LeftBar = ({ userObj }) => {
  const userEtcRef = useRef();
  const dispatch = useDispatch();
  const [creatorInfo, setCreatorInfo] = useState({});
  const [selected, setSelected] = useState(1);
  const [size, setSize] = useState(window.innerWidth);
  const [resize, setResize] = useState(false);
  const [userEtc, setUserEtc] = useState(false);

  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    if (location.pathname === "/") {
      setSelected(1);
    } else if (location.pathname.includes("explore")) {
      setSelected(2);
    } else if (location.pathname.includes("/notice")) {
      setSelected(3);
    } else if (location.pathname.includes("/bookmark")) {
      setSelected(4);
    } else if (location.pathname.includes("/profile")) {
      setSelected(5);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!userEtc) return;
    const handleClick = (e) => {
      if (!userEtcRef?.current?.contains(e.target)) {
        setUserEtc(false);
      } else if (userEtcRef.current === null) {
        console.log("?");
        return;
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.addEventListener("click", handleClick);
  }, [userEtc]);

  // 리사이징
  useEffect(() => {
    // 렌더 시
    if (size < 500) {
      setResize(true);
    } else if (size > 500) {
      setResize(false);
    }
    const Resize = () => {
      let innerSize = window.innerWidth;
      setSize(innerSize);
    };
    window.addEventListener("resize", Resize);
    return () => window.addEventListener("resize", Resize);
  }, [size]);

  useEffect(() => {
    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
    });
  }, [userObj]);

  const onSelect = (num) => {
    setSelected(num);
  };

  const toggleUserEtc = useCallback(() => {
    setUserEtc((prev) => !prev);
  }, []);

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
      history.push("/auth");
    }
  };
  return (
    <article className={styled.container}>
      <section className={styled.wrapper}>
        <section className={styled.leftBar__category}>
          <div className={styled.leftBar__logobox}>
            <div className={styled.leftBar__logo}>
              <Link to="/">
                <FaTwitter />
              </Link>
            </div>
          </div>
          <nav className={styled.leftBar__container}>
            <ul>
              <li>
                <Link to="/" onClick={() => onSelect(1)}>
                  <div className={styled.leftBar__list}>
                    {selected === 1 ? (
                      <>
                        <AiFillHome />
                        <span>
                          <b>홈</b>
                        </span>
                      </>
                    ) : (
                      <>
                        <AiOutlineHome />
                        <span>홈</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to={"/explore/nweets/" + userObj.email?.split("@")[0]}
                  onClick={() => onSelect(2)}
                >
                  <div className={styled.leftBar__list}>
                    {selected === 2 ? (
                      <>
                        <FaHashtag />
                        <span>
                          <b>탐색하기</b>
                        </span>
                      </>
                    ) : (
                      <>
                        <FiHash />
                        <span>탐색하기</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/notice" onClick={() => onSelect(3)}>
                  <div className={styled.leftBar__list}>
                    {selected === 3 ? (
                      <>
                        <BsBellFill />
                        <span>
                          <b>알림</b>
                        </span>
                      </>
                    ) : (
                      <>
                        <BsBell />
                        <span>알림</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/bookmark" onClick={() => onSelect(4)}>
                  <div className={styled.leftBar__list}>
                    {selected === 4 ? (
                      <>
                        <IoBookmark />
                        <span>
                          <b>북마크</b>
                        </span>
                      </>
                    ) : (
                      <>
                        <IoBookmarkOutline />
                        <span>북마크</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  // to={"/profile/mynweets/" + userObj.email?.split("@")[0]}
                  to={"/profile/mynweets/" + userObj.email}
                  onClick={() => onSelect(5)}
                >
                  <div className={styled.leftBar__list}>
                    {selected === 5 ? (
                      <>
                        <BsPersonFill />
                        <span>
                          <b>프로필</b>
                        </span>
                      </>
                    ) : (
                      <>
                        <BsPerson />
                        <span>프로필</span>
                      </>
                    )}

                    {resize && (
                      <div className={styled.userInfo__profileHidden}>
                        <div className={styled.userInfo__profile}>
                          <img
                            src={creatorInfo.photoURL}
                            alt="profileImg"
                            className={styled.profile__image}
                          />
                        </div>
                      </div>
                    )}
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
        <div style={{ position: "relative" }} ref={userEtcRef}>
          {userEtc && (
            <UserEtcBtn
              onLogOutClick={onLogOutClick}
              creatorInfo={creatorInfo}
            />
          )}
          <section className={styled.leftBar__user}>
            <div className={styled.leftBar__userInfo} onClick={toggleUserEtc}>
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
          </section>
        </div>
      </section>
    </article>
  );
};

export default LeftBar;
