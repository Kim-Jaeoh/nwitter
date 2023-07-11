import CircleLoader from "../loader/CircleLoader";
import Nweet from "../nweet/Nweet";
import styled from "./SelectNoInfo.module.css";
import useGetFbInfo from "../../hooks/useGetFbInfo";

const MyNweets = ({ myNweets, userObj }) => {
  const { reNweets } = useGetFbInfo();

  return (
    <>
      {reNweets ? (
        <>
          {myNweets.length !== 0 ? (
            <div>
              {myNweets.map((myNweet, index) => (
                <Nweet
                  key={index}
                  nweetObj={myNweet}
                  reNweetsObj={reNweets}
                  userObj={userObj}
                  isOwner={myNweet.creatorId === userObj.uid}
                />
              ))}
            </div>
          ) : (
            <div className={styled.noInfoBox}>
              <div className={styled.noInfo}>
                <h2>아직 트윗이 없습니다</h2>
                <p>지금 일어나는 일을 트윗에 담아보세요.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <CircleLoader />
      )}
    </>
  );
};

export default MyNweets;
