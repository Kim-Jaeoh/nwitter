import { combineReducers } from "redux";
import user from "./user";

// export const USER_LOGOUT = "USER_LOGOUT";
// export const settingLogOut = () => ({
//   type: USER_LOGOUT,
// });

const appReducer = combineReducers({
  user,
});

const rootReducer = (state, action) => {
  // if (action.type === USER_LOGOUT) {
  // 	state = undefined;
  // }
  return appReducer(state, action);
};

// export function* rootSaga() {
//   // yield all([itemSaga()])
// }

export default rootReducer;
