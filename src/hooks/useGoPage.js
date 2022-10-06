import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

export const useGoPage = (nweetObj, etcRef, imgRef, nameRef, replyRef) => {
  const history = useHistory();
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);

  const goProfile = (e) => {
    if (imgRef?.current?.contains(e.target)) {
      if (nweetObj.email !== currentUser.email) {
        history.push("/user/mynweets/" + nweetObj.email);
      } else {
        history.push("/profile/mynweets/" + nweetObj.email);
      }
    }
    if (nameRef?.current?.contains(e.target)) {
      if (nweetObj.email !== currentUser.email) {
        history.push("/user/mynweets/" + nweetObj.email);
      } else {
        history.push("/profile/mynweets/" + nweetObj.email);
      }
    }
    if (replyRef?.current?.contains(e.target)) {
      if (nweetObj.email !== currentUser.email) {
        history.push("/user/mynweets/" + nweetObj.parentEmail);
      } else {
        history.push("/profile/mynweets/" + nweetObj.parentEmail);
      }
    }
  };

  const goNweet = (e) => {
    if (
      nweetObj?.parent &&
      !imgRef?.current?.contains(e.target) &&
      !nameRef?.current?.contains(e.target) &&
      !replyRef?.current?.contains(e.target) &&
      !etcRef?.current?.contains(e.target)
    ) {
      history.push("/nweet/" + nweetObj.parent);
    } else if (
      !nweetObj?.parent &&
      !imgRef?.current?.contains(e.target) &&
      !nameRef?.current?.contains(e.target) &&
      !replyRef?.current?.contains(e.target) &&
      !etcRef?.current?.contains(e.target)
    ) {
      history.push("/nweet/" + nweetObj.id);
    }
  };

  const goNotice = (e) => {
    if (
      imgRef.current.contains(e.target) ||
      nameRef.current.contains(e.target)
    ) {
      history.push("/user/mynweets/" + nweetObj.email);
    } else if (
      !imgRef.current.contains(e.target) &&
      !nameRef.current.contains(e.target) &&
      !location.pathname.includes("followers")
    ) {
      history.push("/nweet/" + nweetObj.parent);
    }
  };

  const goParent = (e, type) => {
    if (
      imgRef.current.contains(e.target) ||
      nameRef.current.contains(e.target)
    ) {
      history.push("/profile/mynweets/" + nweetObj.email);
    }
  };

  return { goNweet, goProfile, goNotice, goParent };
};
