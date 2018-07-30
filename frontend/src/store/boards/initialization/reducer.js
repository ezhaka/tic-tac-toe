import {
  BOARD_CREATED,
  BOARD_LIST_LOADED,
  FINISHED_BOARD_LOADED,
  MOVE_MADE,
  PLAYER_JOINED,
  PLAYER_WON
} from "../actions";

const initialState = {
  isInitialized: false,
  pendingActions: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PLAYER_JOINED:
    case MOVE_MADE:
    case PLAYER_WON:
    case BOARD_CREATED:
    case FINISHED_BOARD_LOADED: {
      if (!state.isInitialized) {
        return {
          ...state,
          pendingActions: [...state.pendingActions, action]
        };
      }

      return state;
    }

    case BOARD_LIST_LOADED:
      return {
        isInitialized: true,
        pendingActions: []
      };

    default:
      return state;
  }
}
