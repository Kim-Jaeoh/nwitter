import React from "react";
import { SyncLoader } from "react-spinners";

function Loading() {
  return (
    <div className="contentWrap">
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "10",
        }}
      >
        <SyncLoader
          color="#429170"
          size={5}
          margin={2}
          style={{ opacity: "80%" }}
        />
      </div>
    </div>
  );
}

export default Loading;
