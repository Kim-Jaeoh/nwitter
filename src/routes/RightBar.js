import styled from "./RightBar.module.css";
import { FiSearch } from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import RecommendUser from "../components/RecommendUser";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { dbService } from "../fbase";
import { debounce } from "lodash";
import SearchBox from "../components/SearchBox";

const RightBar = ({ userObj }) => {
  const searchRef = useRef();
  const textRef = useRef();
  const [focus, setFocus] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [nweets, setNweets] = useState([]);
  const [userResult, setUserResult] = useState([]);
  const [nweetResult, setNweetResult] = useState([]);

  // console.log(userResult.id === nweetResult.id);
  // console.log(users);
  console.log(userResult);

  useEffect(() => {
    const userInfo = async () => {
      const q = query(collection(dbService, "users"));
      const data = await getDocs(q);

      const userArray = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 본인 제외 노출
      // const exceptArray = userArray.filter((name) => name.uid !== userObj.uid);
      // setUsers(exceptArray);
      setUsers(userArray);
    };

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
          // const exceptArray = nweetArray.filter(
          //   (name) => name.id !== userObj.id
          // );
          // setNweets(exceptArray);
          setNweets(nweetArray);
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
      const filterNameAndEmail = users.filter(
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
      const filterNweets = nweets.filter((nweet) =>
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
      <RecommendUser userObj={userObj} />
    </article>
  );
};

export default RightBar;
