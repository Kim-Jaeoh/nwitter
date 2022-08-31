import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { dbService } from "../fbase";
import styled from "./SearchBar.module.css";
import SearchBox from "./SearchBox";

export const SearchBar = ({ userObj }) => {
  const searchRef = useRef();
  const textRef = useRef();

  const [focus, setFocus] = useState(false);
  const [search, setSearch] = useState("");
  const [userResult, setUserResult] = useState([]);
  const [nweetResult, setNweetResult] = useState([]);
  const [users, setUsers] = useState([]);
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    // 유저 정보
    const userInfo = async () => {
      const q = query(collection(dbService, "users"));
      const data = await getDocs(q);

      const userArray = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 본인 제외 노출
      const exceptArray = userArray.filter((name) => name.uid !== userObj.uid);
      setUsers(exceptArray);
    };

    // 트윗 정보
    const nweetInfo = async () => {
      const q = query(collection(dbService, "nweets"));
      onSnapshot(
        q,
        (snapshot) => {
          const nweetArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // 본인 제외 노출
          const exceptArray = nweetArray.filter(
            (name) => name.creatorId !== userObj.uid
          );
          setNweets(exceptArray);
        },
        []
      );
    };
    userInfo();
    nweetInfo();
  }, [userObj]);

  useEffect(() => {
    // 닉네임/이메일 검색
    if (focus && search !== "") {
      const filterNameAndEmail = users?.filter(
        (user) =>
          user.displayName.includes(search) ||
          user.email.split("@")[0].includes(search)
      );
      setUserResult(filterNameAndEmail);
    } else {
      setUserResult("");
    }
    // 트윗 검색
    if (focus && search !== "") {
      const filterNweets = nweets?.filter((nweet) =>
        nweet.text.includes(search)
      );
      setNweetResult(filterNweets);
    } else {
      setNweetResult("");
    }
  }, [focus, nweets, search, users]);

  useEffect(() => {
    if (!focus) return;
    const handleClick = (e) => {
      if (searchRef?.current === null) return;

      if (!searchRef.current.contains(e.target)) {
        setFocus(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.addEventListener("click", handleClick);
  }, [focus]);

  const onClick = useCallback((e) => {
    setFocus(true);
    textRef.current.focus();
  }, []);

  const onChange = debounce((e) => {
    textRef.current.focus();
    setSearch(e.target.value);
  }, 200);

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
            spellCheck={false}
            ref={textRef}
            className={styled.search__bar}
            placeholder="트위터 검색"
            onChange={onChange}
          />
        </div>
        {focus && (
          <SearchBox
            userObj={userObj}
            search={search}
            users={users}
            focus={focus}
            nweets={nweets}
            userResult={userResult}
            nweetResult={nweetResult}
          />
        )}
      </section>
    </article>
  );
};
