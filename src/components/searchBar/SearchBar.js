import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { dbService } from "../../fbase";
import { useNweetEctModalClick } from "../../hooks/useNweetEctModalClick";
import styled from "./SearchBar.module.css";
import SearchBox from "./SearchBox";

export const SearchBar = ({ userObj }) => {
  const searchRef = useRef();
  const textRef = useRef();

  // const [focus, setFocus] = useState(false);
  const [search, setSearch] = useState("");
  const [userResult, setUserResult] = useState([]);
  const [nweetResult, setNweetResult] = useState([]);
  const [users, setUsers] = useState([]);
  const [nweets, setNweets] = useState([]);
  const [select, setSelect] = useState("");
  const [loading, setLoading] = useState(false);

  const { nweetEtc: focus, setNweetEtc: setFocus } =
    useNweetEctModalClick(searchRef);

  const onClick = useCallback(
    (e) => {
      setFocus(true);
      textRef.current.focus();
    },
    [setFocus]
  );

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
            (nweet) => nweet.creatorId !== userObj.uid
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
      setLoading(true);
    } else {
      setUserResult("");
    }
    // 트윗 검색
    if (focus && search !== "") {
      const filterNweets = nweets?.filter((nweet) =>
        nweet.text.includes(search)
      );
      setNweetResult(filterNweets);
      setLoading(true);
    } else {
      setNweetResult("");
    }
  }, [focus, nweets, search, users]);

  // 디바운스
  // - 방법 1
  // const onChange = useCallback((e) => {
  //   textRef.current.focus();
  //   setTimeout(() => {
  //     setSearch(e.target.value);
  //   }, 200);
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     clearTimeout(onChange);
  //   };
  // }, [onChange]);

  // - 방법 2
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
            onFocus={() => setSelect("text")}
            onBlur={() => setSelect("")}
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
            loading={loading}
          />
        )}
      </section>
    </article>
  );
};
