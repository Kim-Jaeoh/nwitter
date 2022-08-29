import { collection, onSnapshot, query, where } from "firebase/firestore";
import { orderBy } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { dbService } from "../fbase";
import Nweet from "./Nweet";

const MyNweets = ({ myNweets, userObj }) => {
  return (
    <>
      {myNweets.length !== 0 && (
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
      )}
    </>
  );
};

export default MyNweets;
