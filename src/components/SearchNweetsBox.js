import { useState } from "react";
import { useEffect } from "react";
import styled from "./SearchNweetsBox.module.css";

const SearchNweetsBox = ({ users, nweet }) => {
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const filtered = users.filter((user) => {
      return user.uid === nweet.creatorId;
    });
    setFilter(filtered);
  }, [nweet, users]);

  return (
    <>
      {filter[0] && (
        <li key={nweet.creatorId} className={styled.follow__user}>
          <div className={styled.follow__userInfo}>
            <img
              src={filter[0].photoURL}
              alt="profileImg"
              className={styled.follow__image}
            />
            <div className={styled.follow__name}>
              <p>{filter[0].displayName}</p>
              <p>@{filter[0].email.split("@")[0]}</p>
              {filter[0].description && <p>{filter[0].description}</p>}
            </div>
          </div>
          <div className={styled.searchText}>
            <p>{nweet.text}</p>
          </div>
        </li>
      )}
    </>
  );
};

export default SearchNweetsBox;