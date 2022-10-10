import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import { createStore } from "redux";
import rootReducer from "../reducer";
// localStorage에 저장하고 싶으면
import storage from "redux-persist/lib/storage";
// session Storage에 저장하고 싶으면
// import storageSession from "redux-persist/lib/storage/session";

//persist 설정
const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["특정 리듀서"] // 특정한 reducer만 localStorage에 저장하고 싶을 경우
};

// persistedReducer 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store, persistor를 리턴하는 함수
const configureStore = () => {
  const store = createStore(persistedReducer, composeWithDevTools());
  const persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
