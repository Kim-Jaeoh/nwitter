import { useHistory } from "react-router-dom";
import styled from "./SearchNweetsBox.module.css";

const SearchUsersBox = ({ userResult }) => {
  const history = useHistory();

  const goPage = (userId) => {
    history.push("/profile/mynweets/" + userId.email);
  };

  const showMore = () => {
    history.push("/explore/users/");
  };

  return (
    <>
      {userResult.map((user, index) => (
        <>
          {index < 4 && (
            <div
              key={user.id}
              className={styled.follow__user}
              onClick={() => goPage(user)}
            >
              <div className={styled.follow__userInfo}>
                <img
                  src={user.photoURL}
                  alt="프로필 이미지"
                  className={styled.follow__image}
                />
                <div className={styled.follow__name}>
                  <p>{user.displayName}</p>
                  <p>@{user.email.split("@")[0]}</p>
                  {user.description && <p>{user.description}</p>}
                </div>
              </div>
            </div>
          )}
        </>
      ))}
      {userResult.length >= 4 && (
        <div className={styled.more} onClick={showMore}>
          더 보기
        </div>
      )}
    </>
  );
};

export default SearchUsersBox;
