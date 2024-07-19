export const initialState = {
  started: 0,
  user: null,
  Scale: 1,
  num: 0,
  searchContentSearch: "",
};

const reducer = (state, action) => {
  //console.log(action);
  switch (action.type) {
    case "SET_MESSAGE":
      return {
        ...state,
        displayName: action.displayName,
        photoUrl: action.photoUrl,
        uid: action.uid,
      };

    case "SET_STARTED":
      return {
        ...state,
        started: action.started,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_SCALE":
      return {
        ...state,
        num: action.Scale,
      };

    case "SET_SEARCH":
      return {
        ...state,
        searchContentSearch: action.searchContentSearch,
      };

    default:
      return state;
  }
};

export default reducer;
