import { omit, keyBy } from "lodash";
import {
  BOARD_CREATED,
  BOARD_LIST_LOADED,
  FINISHED_BOARD_LOADED,
  LEAVE_BOARD,
  MOVE_MADE,
  PLAYER_JOINED,
  PLAYER_WON
} from "../actions";

const initialState = {};

const applyBoardAction = currentBoardId => (state, action) => {
  if (action.boardVersion) {
    const board = state[action.boardId];
    if (board && board.version >= action.boardVersion) {
      return state;
    }
  }

  const updateBoard = (boardId, mapper) => ({
    ...state,
    [boardId]: mapper(state[boardId])
  });

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

      if (currentBoardId !== boardId) {
        return omit(state, boardId);
      }

      return updateBoard(boardId, board => ({
        ...board,
        moves: [...board.moves, move],
        winner
      }));
    }

    case BOARD_CREATED:
    case FINISHED_BOARD_LOADED:
      return { ...state, [action.board.id]: action.board };

    default:
      return state;
  }
};

export default function reducer(
  state = initialState,
  action,
  currentBoardId,
  initialzation = { pendingActions: [] }
) {
  switch (action.type) {
    case PLAYER_JOINED:
    case MOVE_MADE:
    case PLAYER_WON:
    case BOARD_CREATED:
    case FINISHED_BOARD_LOADED:
      if (!initialzation.isInitialized) {
        return state;
      }

      return applyBoardAction(currentBoardId)(state, action);

    case BOARD_LIST_LOADED: {
      const nextState = keyBy(action.boards, board => board.id);

      if (currentBoardId && !nextState[currentBoardId]) {
        const currentBoard = state[currentBoardId];
        nextState[currentBoardId] = {
          ...currentBoard,
          dirty: !currentBoard.winner
        };
      }

      return initialzation.pendingActions.reduce(
        applyBoardAction(currentBoardId),
        nextState
      );
    }

    case LEAVE_BOARD: {
      const board = state[currentBoardId];
      return board && board.winner ? omit(state, currentBoardId) : state;
    }

    default:
      return state;
  }
}
