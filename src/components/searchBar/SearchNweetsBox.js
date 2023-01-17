import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "./SearchNweetsBox.module.css";

const SearchNweetsBox = ({ users, nweet }) => {
  const history = useHistory();
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const filtered = users.filter((user) => user.uid === nweet.creatorId);
    setFilter(filtered);
  }, [nweet, users]);

  const goPage = () => {
    history.push("/nweet/" + nweet.id);
  };

  return (
    <>
      {filter[0] && (
        <div className={styled.follow__user} onClick={goPage}>
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
        </div>
      )}
    </>
  );
};

export default SearchNweetsBox;
