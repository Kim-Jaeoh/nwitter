import React from "react";
import { SyncLoader } from "react-spinners";
import FadeLoader from "react-spinners/FadeLoader";

function Loading() {
  return (
    <div className="contentWrap">
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "10",
        }}
      >
        <SyncLoader
          color="#28A6FF"
          size={5}
          margin={2}
          style={{ opacity: "80%" }}
        />
      </div>
    </div>
  );
}

export default Loading;
