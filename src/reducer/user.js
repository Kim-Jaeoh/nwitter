export const SET_LOGIN_TOKEN = "SET_LOGIN_TOKEN";
export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const SET_MODE = "SET_MODE";

export const setLoginToken = (loginToken) => ({
  type: SET_LOGIN_TOKEN,
  payload: loginToken,
});

export const setCurrentUser = (currentUser) => ({
  type: SET_CURRENT_USER,
  payload: currentUser,
});

export const setMode = (mode) => ({
  type: SET_MODE,
  payload: mode,
});

const initialState = {
  loginToken: "logout",
  currentUser: {
    uid: "",
    photoURL: "",
    displayName: "",
    createdAtId: "",
    description: "",
    email: "",
    bgURL: "",
    // bookmark: [],
    // rejweet: [],
    // follower: [],
    // following: [],
  },
  mode: "white",
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN_TOKEN:
      return {
        ...state,
        loginToken: action.payload,
      };

    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };

    case SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };

    default:
      return state;
  }
};

export default user;
