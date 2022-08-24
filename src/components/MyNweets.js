import { useLocation } from "react-router-dom";
import Nweet from "./Nweet";

const MyNweets = ({ myNweets, userObj }) => {
  // const location = useLocation();
  // console.log(location.pathname);

  return (
    <div>
      {myNweets.map((myNweet, index) => (
        <Nweet
          key={index}
          nweetObj={myNweet}
          userObj={userObj}
          isOwner={myNweet.creatorId === userObj.uid}
        />
      ))}
    </div>
  );
};

export default MyNweets;
