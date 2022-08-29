import { useLocation } from "react-router-dom";
import Nweet from "./Nweet";
import styled from "./LikeNweets.module.css";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { dbService } from "../fbase";
import { orderBy } from "lodash";

const LikeNweets = ({ myLikeNweets, userObj }) => {
  return (
    <div>
      {myLikeNweets.map((myNweet) => (
        <Nweet key={myNweet.id} nweetObj={myNweet} userObj={userObj} />
      ))}
    </div>
  );
};

export default LikeNweets;
