import styled from "./RightBar.module.css";
import { FiSearch } from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import RecommendUser from "../components/RecommendUser";

const RightBar = ({ userObj }) => {
  const searchRef = useRef();
  const textRef = useRef();
  const [focus, setFocus] = useState(false);

  const onClick = useCallback(
    (e) => {
      setFocus(!focus);
      textRef.current.focus();
      console.log(focus);
    },
    [focus]
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (!searchRef.current.contains(e.target)) {
        setFocus(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.addEventListener("click", handleClick);
  }, [focus]);

  return (
    <article className={styled.container}>
      <section className={styled.searchbox}>
        <div
          className={`${styled.search} ${focus && styled.search__focus}`}
          onClick={onClick}
          ref={searchRef}
        >
          <FiSearch
            className={`${styled.search__icon} ${
              focus && styled.search__focusIcon
            }`}
          />
          <input
            ref={textRef}
            className={styled.search__bar}
            placeholder="트위터 검색"
          />
        </div>
      </section>
      <RecommendUser userObj={userObj} />
    </article>
  );
};

export default RightBar;
