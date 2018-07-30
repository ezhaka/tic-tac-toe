import { CHANGE_BOARD_PAGE_STATUS } from "./actions";
import { ENTER_BOARD, LEAVE_BOARD } from "../actions";

const initialState = {
  currentBoardId: undefined,
  status: undefined
};

export const statuses = {
  ERROR: "ERROR",
  ERROR_404: "ERROR_404"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ENTER_BOARD:
      return { ...state, currentBoardId: action.boardId };

    case LEAVE_BOARD:
      return initialState;

    case CHANGE_BOARD_PAGE_STATUS:
      return { ...state, status: action.status };

    default:
      return state;
  }
}
