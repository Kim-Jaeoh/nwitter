import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div>Not Found!</div>
      <div>
        <Link to="/">홈페이지로 돌아가기</Link>
      </div>
    </>
  );
};

export default NotFound;
