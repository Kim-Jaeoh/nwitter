import RecommendUser from "../components/RecommendUser";
import styled from "./RightBar.module.css";
import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { dbService } from "../fbase";
import { useLocation } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";

const RightBar = ({ userObj }) => {
  const location = useLocation();
  const [hiddenSearch, setHiddenSearch] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("explore")) {
      setHiddenSearch(true);
    }
    return () => setHiddenSearch(false);
  }, [location.pathname]);

  return (
    <article className={styled.container}>
      {!hiddenSearch && <SearchBar userObj={userObj} />}
      <RecommendUser userObj={userObj} />
    </article>
  );
};

export default RightBar;
