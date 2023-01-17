import { useHistory } from "react-router-dom";
import styled from "./SearchBox.module.css";
import SearchNweetsBox from "./SearchNweetsBox";
import SearchUsersBox from "./SearchUsersBox";

const SearchBox = ({
  userResult,
  nweetResult,
  users,
  search,
  focus,
  userObj,
}) => {
  const history = useHistory();

  const showMore = () => {
    history.push("/explore/nweets/");
  };

  return (
    <>
      {focus && (
        <article className={styled.container}>
          {search === "" && (
            <div className={styled.notice}>
              <p>사용자, 키워드를 검색해보세요.</p>
              <span>(본인 정보는 노출되지 않습니다.)</span>
            </div>
          )}
          {search !== "" &&
            userResult?.length === 0 &&
            nweetResult?.length === 0 && (
              <div className={styled.notice}>
                <p>검색하신 결과가 없습니다.</p>
                <span>(본인 정보는 노출되지 않습니다.)</span>
              </div>
            )}
          <div className={styled.searchUser__container}>
            <div style={{ overflow: "hidden" }}>
              <>
                {userResult?.length !== 0 && (
                  <section className={styled.followBox}>
                    <div className={styled.followBox__name}>
                      <h2>유저</h2>
                    </div>
                    <ul className={styled.follows}>
                      <SearchUsersBox userResult={userResult} />
                    </ul>
                  </section>
                )}
                {userResult?.length !== 0 && nweetResult?.length !== 0 && (
                  <div className={styled.line} />
                )}
                {nweetResult?.length !== 0 && (
                  <section className={styled.followBox}>
                    <div className={styled.followBox__name}>
                      <h2>트윗</h2>
                    </div>
                    <ul className={styled.follows}>
                      {nweetResult?.map((nweet, index) => (
                        <>
                          {index < 4 && (
                            <SearchNweetsBox
                              key={nweet.id}
                              users={users}
                              nweet={nweet}
                            />
                          )}
                        </>
                      ))}
                      {nweetResult.length >= 4 && (
                        <div className={styled.more} onClick={showMore}>
                          더 보기
                        </div>
                      )}
                    </ul>
                  </section>
                )}
              </>
            </div>
          </div>
        </article>
      )}
    </>
  );
};
export default SearchBox;
