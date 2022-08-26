import { useEffect } from "react";
import { useState } from "react";
import Loading from "./Loading";
import styled from "./SearchBox.module.css";
import SearchNweetsBox from "./SearchNweetsBox";

const SearchBox = ({
  userResult,
  nweetResult,
  nweets,
  users,
  search,
  focus,
}) => {
  return (
    <>
      {focus && (
        <article className={styled.container}>
          {search === "" && (
            <div className={styled.notice}>
              <p>사용자, 키워드를 검색해보세요</p>
            </div>
          )}
          {search !== "" &&
            userResult.length === 0 &&
            nweetResult.length === 0 && (
              <div className={styled.notice}>
                <p>검색하신 결과가 없습니다</p>
              </div>
            )}
          <div className={styled.searchUser__container}>
            <>
              {userResult.length !== 0 && (
                <section className={styled.followBox}>
                  <div className={styled.followBox__name}>
                    <h2>유저</h2>
                  </div>
                  <ul className={styled.follows}>
                    {userResult.map((user, index) => {
                      return (
                        <li key={user.id} className={styled.follow__user}>
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
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
              {userResult.length !== 0 && nweetResult.length !== 0 && (
                <div className={styled.line} />
              )}
              {nweetResult.length !== 0 && (
                <section className={styled.followBox}>
                  <div className={styled.followBox__name}>
                    <h2>트윗</h2>
                  </div>
                  <ul className={styled.follows}>
                    {nweetResult.map((nweet, index) => {
                      return (
                        <>
                          <SearchNweetsBox users={users} nweet={nweet} />
                        </>
                      );
                    })}
                  </ul>
                </section>
              )}
            </>
          </div>
        </article>
      )}
    </>
  );
};
export default SearchBox;
