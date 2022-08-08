// import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import { createStore } from "redux";
import rootReducer from "../reducer";
import storage from "redux-persist/lib/storage";

// const persistedReducer = persistReducer(persistConfig, reducers);

// export default function configureStore() {
//   const store = createStore(rootReducer, composeWithDevTools());
//   const persistor = persistStore(store);
//   return { store };
// }

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
  const store = createStore(persistedReducer, {}, composeWithDevTools());
  const persistor = persistStore(store);
  return { store, persistor };
}
