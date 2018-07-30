import {
  BOARD_CREATION_FAILED,
  BOARD_CREATION_IN_PROGRESS,
  BOARD_CREATION_SUCCESSFUL,
  RESET_BOARD_CREATION_ERROR
} from "./actions";

export const statuses = {
  IN_PROGRESS: "IN_PROGRESS",
  ERROR: "ERROR"
};

const initialState = {
  status: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case BOARD_CREATION_FAILED:
      return { status: statuses.ERROR };

    case BOARD_CREATION_IN_PROGRESS:
      return { status: statuses.IN_PROGRESS };

    case BOARD_CREATION_SUCCESSFUL:
      return initialState;

    case RESET_BOARD_CREATION_ERROR:
      return state.status === statuses.ERROR ? initialState : state;

    default:
      return state;
  }
}
