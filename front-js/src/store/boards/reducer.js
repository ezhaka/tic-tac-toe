import { keyBy } from "lodash";
import {
  BOARD_CREATED,
  BOARD_LIST_LOADED,
  MOVE_MADE,
  PLAYER_JOINED,
  PLAYER_WON
} from "./actions";

const initialState = { entities: {}, isInitialized: false, pendingActions: [] };

function applyAction(state, action) {
  const updateBoard = (boardId, mapper) => {
    const board = state.entities[boardId]; // TODO: это не круто, лучше разбить на разные редьюсеры
    return { entities: { ...state.entities, [boardId]: mapper(board) } };
  };

  switch (action.type) {
    case PLAYER_JOINED: {
      const { boardId, player } = action;
      return updateBoard(boardId, board => ({
        ...board,
        players: [...board.players, player]
      }));
    }

    case MOVE_MADE: {
      const { boardId, move } = action;
      return updateBoard(boardId, board => ({
        ...board,
        moves: [...board.moves, move]
      }));
    }

    case PLAYER_WON: {
      const { boardId, move, winner } = action;
      return updateBoard(boardId, board => ({
        ...board,
        moves: [...board.moves, move],
        winner
      }));
    }

    case BOARD_CREATED:
      return updateBoard(action.board.id, () => action.board);

    default:
      return state;
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case PLAYER_JOINED:
    case MOVE_MADE:
    case PLAYER_WON:
    case BOARD_CREATED: {
      if (!state.isInitialized && action.type !== BOARD_LIST_LOADED) {
        return {
          ...state,
          pendingActions: [...state.pendingActions, action]
        };
      }

      return {
        ...state,
        ...applyAction(state, action)
      };
    }

    case BOARD_LIST_LOADED: {
      const entities = keyBy(action.boards, board => board.id);
      return {
        ...state.pendingActions.reduce(applyAction, { entities }),
        isInitialized: true,
        pendingActions: []
      };
    }

    default:
      return state;
  }
}
