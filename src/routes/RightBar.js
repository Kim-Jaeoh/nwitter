import RecommendUser from "../components/recommendUser/RecommendUser";
import styled from "./RightBar.module.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchBar } from "../components/searchBar/SearchBar";

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
