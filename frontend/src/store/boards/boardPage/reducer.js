import { ENTER_BOARD, LEAVE_BOARD } from "../actions";

const initialState = {
  currentBoardId: undefined,
  status: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ENTER_BOARD:
      return { ...state, currentBoardId: action.boardId };

    case LEAVE_BOARD:
      return { ...state, currentBoardId: undefined };

    default:
      return state;
  }
}
