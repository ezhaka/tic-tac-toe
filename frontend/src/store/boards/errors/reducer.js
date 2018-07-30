import { SET_UNABLE_TO_CREATE_BOARD } from "./actions";

const initialState = {
  unableToCreateBoard: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_UNABLE_TO_CREATE_BOARD:
      return { ...state, unableToCreateBoard: action.isError };

    default:
      return state;
  }
}
