import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";
import { authService, dbService } from "../fbase";
import noneProfile from "../image/noneProfile.jpg";
import bgImg from "../image/bgimg.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setLoginToken } from "../reducer/user";
import styled from "./Profile.module.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { BsCalendar3 } from "react-icons/bs";
import UpdateProfileModal from "../components/UpdateProfileModal";
import Nweet from "../components/Nweet";
import MyNweets from "../components/MyNweets";
import ReNweets from "../components/ReNweets";
import LikeNweets from "../components/LikeNweets";
import SelectMenuBtn from "../components/SelectMenuBtn";
import Loading from "../components/Loading";
import { GrClose } from "react-icons/gr";
import { IoMdExit } from "react-icons/io";

const Profile = ({ refreshUser, userObj }) => {
  const currentUsers = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  // const history = useHistory();
  // const { uid } = useParams(userObj.uid);

  // 회원가입 시 디스패치 된 정보 state에 담기
  // const [creatorInfo, setCreatorInfo] = useState({
  //   displayName: currentUsers.displayName,
  //   email: currentUsers.email,
  //   photoURL: currentUsers.photoURL,
  //   bgURL: currentUsers.bgURL,
  //   createdAtId: currentUsers.createdAtId,
  // });

  const [creatorInfo, setCreatorInfo] = useState({});
  const [loading, setLoading] = useState(null);
  const [myNweets, setMyNweets] = useState([]);
  const [selected, setSelected] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const history = useHistory();

  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("/mynweets")) {
      setSelected(1);
    } else if (location.pathname.includes("/renweets")) {
      setSelected(2);
    } else if (location.pathname.includes("/likenweets")) {
      setSelected(3);
    }
  }, [location.pathname]);

  // 필터링 방법 (본인이 작성한 것 확인)
  const getMyNweets = useCallback(() => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const array = [];
      querySnapshot.forEach((doc) => {
        array.push(doc.data());
      });
      setMyNweets(array);
    });
  }, [userObj.uid]);

  //   // 위와 같은 방식
  //   // const querySnapshot = await getDocs(collection(dbService, "nweets"),
  //   //   where("creatorId", "==", userObj.uid),
  //   //   orderBy("createdAt", "desc")
  //   // );

  //   const querySnapshot = await getDocs(q);

  //   console.log(querySnapshot.docs.map((doc) => doc.data()));

  //   // forEach은 return 값(반환값)이 없다
  //   // querySnapshot.forEach((doc) => {
  //   //   console.log(doc.id, "HI", doc.data());
  //   // });
  // };

  // 렌더링 시 실시간 정보 가져오고 이메일, 닉네임, 사진 바뀔 때마다 리렌더링(업데이트)
  useEffect(() => {
    setLoading(true);

    onSnapshot(doc(dbService, "users", userObj.email), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(false);
    });
    getMyNweets();

    return () => setLoading(false); // cleanup function을 이용
  }, [getMyNweets, userObj]);

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

  // const onChange = (e, type) => {
  //   setNewDisplayName(e.target.value);
  // };

  // // 이미지 압축
  // const compressImage = async (image) => {
  //   try {
  //     const options = {
  //       maxSizeMb: 1,
  //       maxWidthOrHeight: 500,
  //     };
  //     return await imageCompression(image, options);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // // 이미지 URL로 바꾸는 로직 - hook 예정(useFileChange)
  // const onFileChange = async (e) => {
  //   setIsAddFile(true);
  //   const theFile = e.target.files[0]; // 파일 1개만 첨부
  //   const compressedImage = await compressImage(theFile); // 이미지 압축
  //   const reader = new FileReader(); // 파일 이름 읽기

  //   reader.onloadend = (finishedEvent) => {
  //     setAttachment(finishedEvent.currentTarget.result);
  //   };

  //   /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
  //       Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
  //   if (theFile) {
  //     reader.readAsDataURL(compressedImage);
  //   }
  // };

  // const onFileBgChange = async (e) => {
  //   setIsAddFile(true);
  //   const theFile = e.target.files[0]; // 파일 1개만 첨부
  //   const compressedImage = await compressImage(theFile); // 이미지 압축
  //   const reader = new FileReader(); // 파일 이름 읽기

  //   reader.onloadend = (finishedEvent) => {
  //     setAttachmentBg(finishedEvent.currentTarget.result);
  //   };

  //   /* 파일 선택 누르고 이미지 한 개 선택 뒤 다시 파일선택 누르고 취소 누르면
  //       Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 이런 오류가 나옴. -> if문으로 예외 처리 */
  //   if (theFile) {
  //     reader.readAsDataURL(compressedImage);
  //   }
  // };

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   await updateDoc(doc(dbService, "users", userObj.email), {
  //     displayName: newDisplayName, // 바뀐 이름 업데이트
  //     photoURL: attachment === "" ? noneProfile : attachment,
  //     bgURL: attachmentBg === "" ? bgImg : attachmentBg,
  //     description: creatorInfo.description,
  //   });
  //   await dispatch(
  //     setCurrentUser({
  //       // uid: currentUsers.uid,
  //       photoURL: attachment === "" ? noneProfile : attachment,
  //       bgURL: attachmentBg === "" ? bgImg : attachmentBg,
  //       displayName: newDisplayName, // 바뀐 이름 디스패치
  //       description: creatorInfo.description,
  //       // email: currentUsers.email,
  //       // bookmark: currentUsers.bookmark,
  //       // follower: currentUsers.follower,
  //       // following: currentUsers.following,
  //       // rejweet: currentUsers.rejweet,
  //     })
  //   );

  //   if (isDeletePhotoURL) {
  //     await updateDoc(doc(dbService, "users", userObj.email), {
  //       photoURL: noneProfile,
  //       bgURL: bgImg,
  //     });
  //     await dispatch(
  //       setCurrentUser({
  //         photoURL: noneProfile,
  //         bgURL: bgImg,
  //       })
  //     );
  //   }
  //   alert(`프로필이 수정되었습니다.`);
  //   // history.push("/");
  // };

  // const onDeleteClick = async () => {
  //   const ok = window.confirm("Are you sure your want to delete this nweet?");
  //   // 이미지 없는 글 삭제 시 에러가 나와서 예외 처리
  //   // (삭제 시 nweetObj.attachmentUrl로 찾아가기 때문)
  //   if (ok) {
  //     setIsDeletePhotoURL(!isDeletePhotoURL);
  //     setAttachment(noneProfile);
  //     setAttachmentBg(bgImg);
  //     setIsAddFile(false);
  //   }
  // };

  const timeToString = (timestamp) => {
    let date = new Date(timestamp);
    let str =
      date.getFullYear() +
      "년 " +
      Number(date.getMonth() + 1) +
      "월 " +
      date.getDate() +
      "일 ";
    return str;
  };

  const onSelect = (num) => {
    setSelected(num);
    console.log(num);
    // setFocus(selected === num);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      {!loading && (
        <section className={styled.container}>
          <div className={styled.main__container}>
            <div className={styled.main__category}>
              <div
                className={styled.main__icon}
                onClick={() => history.goBack()}
              >
                <IoArrowBackOutline />
              </div>
              <div className={styled.userInfo}>
                <p>{creatorInfo.displayName}</p>
                <p>{myNweets.length} 트윗</p>
              </div>
              <div className={styled.main__icon} onClick={onLogOutClick}>
                <IoMdExit />
                {/* <GrClose /> */}
              </div>
            </div>
            <div className={styled.setUserInfo}>
              <div className={styled.backImage}>
                <img
                  // src={creatorInfo.bgURL ? creatorInfo.bgURL : bgImg}
                  src={creatorInfo.bgURL}
                  alt="배경사진"
                />
              </div>
              <div className={styled.profile}>
                <div className={styled.profile__edit}>
                  <div className={styled.profile__image}>
                    <img src={creatorInfo.photoURL} alt="프로필 이미지" />
                  </div>
                  <div className={styled.profile__editBtn} onClick={toggleEdit}>
                    프로필 수정
                  </div>
                </div>
                <div className={styled.profile__info}>
                  <div className={styled.userInfo}>
                    <p>{creatorInfo.displayName}</p>
                    <p>@{creatorInfo?.email?.split("@")[0]}</p>
                  </div>
                  <div className={styled.profile__desc}>
                    {creatorInfo.description === "" ? (
                      <p className={styled.notDesc}>소개글이 없습니다</p>
                    ) : (
                      <p>{creatorInfo.description}</p>
                    )}
                  </div>
                  <div className={styled.profile__createdAt}>
                    <BsCalendar3 />
                    <p>가입일 : {timeToString(creatorInfo.createdAtId)}</p>
                  </div>
                </div>
              </div>
            </div>
            <nav className={styled.categoryList}>
              <SelectMenuBtn
                num={1}
                selected={selected}
                onClick={() => onSelect(1)}
                url={"/profile/mynweets/" + userObj.email?.split("@")[0]}
                text={"트윗"}
              />
              <SelectMenuBtn
                num={2}
                selected={selected}
                onClick={() => onSelect(2)}
                url={"/profile/renweets/" + userObj.email?.split("@")[0]}
                text={"트윗 및 답글"}
              />
              <SelectMenuBtn
                num={3}
                selected={selected}
                onClick={() => onSelect(3)}
                url={"/profile/likenweets/" + userObj.email?.split("@")[0]}
                text={"마음에 들어요"}
              />
            </nav>

            <Switch>
              <Route path="/profile/mynweets/:id">
                {loading && <Loading />} {/* 로딩 시 스피너 */}
                {!loading && <MyNweets myNweets={myNweets} userObj={userObj} />}
              </Route>
              <Route path="/profile/renweets/:id">
                <ReNweets userObj={userObj} />
              </Route>
              <Route path="/profile/likenweets/:id">
                <LikeNweets userObj={userObj} />
              </Route>
            </Switch>
          </div>
        </section>
      )}
      {isEditing && (
        <UpdateProfileModal
          creatorInfo={creatorInfo}
          setCreatorInfo={setCreatorInfo}
          isEditing={isEditing}
          toggleEdit={toggleEdit}
        />
      )}
    </>
  );
};

export default Profile;
