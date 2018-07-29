import { keyBy, omit } from "lodash";
import {
  BOARD_CREATED,
  BOARD_LIST_LOADED,
  MOVE_MADE,
  PLAYER_JOINED,
  PLAYER_WON,
  ENTER_BOARD,
  LEAVE_BOARD,
  FINISHED_BOARD_LOADED
} from "./actions";

const initialState = {
  entities: {},
  isInitialized: false,
  pendingActions: []
};

function applyAction(state, action) {
  const updateBoard = (boardId, mapper) => {
    const board = state.entities[boardId]; // TODO: это не круто, лучше разбить на разные редьюсеры
    return {
      ...state,
      entities: { ...state.entities, [boardId]: mapper(board) }
    };
  };

  if (action.boardVersion) {
    const board = state.entities[action.boardId];
    if (board && board.version >= action.boardVersion) {
      return state;
    }
  }

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

      if (state.currentBoardId !== boardId) {
        return { ...state, entities: omit(state.entities, boardId) };
      }

      return updateBoard(boardId, board => ({
        ...board,
        moves: [...board.moves, move],
        winner
      }));
    }

    case BOARD_CREATED:
    case FINISHED_BOARD_LOADED:
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
    case BOARD_CREATED:
    case FINISHED_BOARD_LOADED: {
      if (!state.isInitialized) {
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
      const { pendingActions, currentBoardId } = state;
      const entities = keyBy(action.boards, board => board.id);

      if (currentBoardId && !entities[currentBoardId]) {
        const currentBoard = state.entities[currentBoardId];
        entities[currentBoardId] = {
          ...currentBoard,
          dirty: !currentBoard.winner
        };
      }

      return {
        ...pendingActions.reduce(applyAction, { entities, currentBoardId }),
        isInitialized: true,
        pendingActions: []
      };
    }

    case ENTER_BOARD:
      return { ...state, currentBoardId: action.boardId };

    case LEAVE_BOARD: {
      const { entities, currentBoardId } = state;
      const board = entities[currentBoardId];

      return {
        ...state,
        currentBoardId: undefined,
        entities: board.winner ? omit(entities, currentBoardId) : entities
      };
    }

    default:
      return state;
  }
}
