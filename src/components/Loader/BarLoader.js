import styled from "./Loading.module.css";

const BarLoader = ({ count }) => {
  return (
    <div className={styled.loader}>
      <div
        className={styled.loader__bar}
        style={{
          width: `${count}%`,
        }}
      />
    </div>
  );
};

export default BarLoader;
