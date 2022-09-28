import { Oval } from "react-loader-spinner";
import styled from "./Loading.module.css";

const CircleLoader = ({ height }) => {
  return (
    <div className={styled.container} style={{ marginTop: height }}>
      <Oval
        height={40}
        width={40}
        color="#429170"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4fa94d"
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
    </div>
  );
};

export default CircleLoader;
