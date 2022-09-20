import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "./TopCategory.module.css";

export const TopCategory = ({
  creatorInfo,
  iconName,
  iconName2,
  text,
  home,
  myNweets,
  onLogOutClick,
}) => {
  const history = useHistory();
  // const location = useLocation();
  // const [selected, setSelected] = useState("home");

  // useEffect(() => {
  //   if (location.pathname === "/") {
  //     setSelected("home");
  //   } else if (
  //     location.pathname.includes("explore") ||
  //     location.pathname.includes("/notice") ||
  //     location.pathname.includes("/bookmark") ||
  //     location.pathname.includes("/profile") ||
  //     location.pathname.includes("/user")
  //   ) {
  //     setSelected("notHome");
  //   }
  // }, [location.pathname]);

  return (
    <>
      {home === "home" ? (
        <div className={styled.main__category}>
          <div className={styled.main_text}>
            <h2>{text}</h2>
          </div>
          <div className={styled.change__emoji}>{iconName}</div>
        </div>
      ) : (
        <div className={styled.minor__category}>
          <div className={styled.minor__icon} onClick={() => history.goBack()}>
            {iconName}
          </div>
          <div className={styled.userInfo}>
            <p className={styled.category__name}>{text}</p>
            {myNweets && (
              <p className={styled.category__sub}>{myNweets.length} 트윗</p>
            )}
            {creatorInfo && (
              <p className={styled.category__sub}>
                @{creatorInfo.email?.split("@")[0]}
              </p>
            )}
          </div>
          {iconName2 && (
            <div className={styled.minor__iconExit} onClick={onLogOutClick}>
              {iconName2}
            </div>
          )}
        </div>
      )}
    </>
  );
};
