import { useEffect, useState } from "react";
import styled from "./Explore.module.css";
import { Route, Switch, useLocation } from "react-router-dom";
import { SearchBar } from "../components/searchBar/SearchBar";
import SelectMenuBtn from "../components/button/SelectMenuBtn";
import ExploreNweets from "../components/explore/ExploreNweets";
import ExploreUsers from "../components/explore/ExploreUsers";

const Explore = ({ userObj }) => {
  const location = useLocation();
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    if (location.pathname.includes("/nweets")) {
      setSelected(1);
    } else if (location.pathname.includes("/users")) {
      setSelected(2);
    }
  }, [location.pathname]);

  const onSelect = (num) => {
    setSelected(num);
  };

  return (
    <>
      <div className={styled.container}>
        <div className={styled.main__container}>
          <div className={styled.main__category}>
            <SearchBar userObj={userObj} />
          </div>
          <nav className={styled.categoryList}>
            <SelectMenuBtn
              num={1}
              selected={selected}
              onClick={() => onSelect(1)}
              url={"/explore/nweets/"}
              text={"트윗"}
            />
            <SelectMenuBtn
              num={2}
              selected={selected}
              onClick={() => onSelect(2)}
              url={"/explore/users"}
              text={"사용자"}
            />
          </nav>
        </div>

        <Switch>
          <Route path="/explore/nweets">
            <ExploreNweets userObj={userObj} />
          </Route>
          <Route path="/explore/users">
            <ExploreUsers userObj={userObj} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default Explore;
