import { useLocation } from "react-router-dom";
import Nweet from "./Nweet";
import styled from "./LikeNweets.module.css";

const LikeNweets = ({ myNweets, userObj }) => {
  // const location = useLocation();
  // console.log(location.pathname);

  return (
    <div className={styled.container}>준비 주웅</div>
    // <div>
    //   {myNweets.map((myNweet) => (
    //     <Nweet
    //       key={myNweet.id}
    //       nweetObj={myNweet}
    //       userObj={userObj}
    //       isOwner={myNweet.creatorId === userObj.uid}
    //     />
    //   ))}
    // </div>
  );
};

export default LikeNweets;
