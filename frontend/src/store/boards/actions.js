import { SEND_WEB_SOCKET_MESSAGE } from "../webSockets/actions";

export const CREATE_BOARD = "CREATE_BOARD";

export const BOARD_CREATED = "BOARD_CREATED";
export const PLAYER_JOINED = "PLAYER_JOINED";
export const MOVE_MADE = "MOVE_MADE";
export const PLAYER_WON = "PLAYER_WON";
export const FINISHED_BOARD_LOADED = "FINISHED_BOARD_LOADED";
export const BOARD_LIST_LOADED = "BOARD_LIST_LOADED";

export const ENTER_BOARD = "ENTER_BOARD";
export const LEAVE_BOARD = "LEAVE_BOARD";

export const makeMove = (boardId, coordinates) => ({
  type: SEND_WEB_SOCKET_MESSAGE,
  payload: { type: "MAKE_MOVE", boardId, coordinates }
});

export const joinBoard = boardId => ({
  type: SEND_WEB_SOCKET_MESSAGE,
  payload: { type: "JOIN_BOARD", boardId }
});

export const createBoard = () => ({ type: CREATE_BOARD });

export const boardCreated = board => ({ type: BOARD_CREATED, board });

export const moveMade = (boardId, userId, row, column) => ({
  type: MOVE_MADE,
  boardId,
  move: {
    userId,
    coordinates: {
      row,
      column
    }
  }
});

export const playerWonMessage = (boardId, move, winner) => ({
  type: PLAYER_WON,
  boardId,
  move,
  winner
});

export const boardLoaded = board => ({ type: FINISHED_BOARD_LOADED, board });

export const boardListLoaded = boards => ({ type: BOARD_LIST_LOADED, boards });

export const enterBoard = boardId => ({ type: ENTER_BOARD, boardId });

export const leaveBoard = () => ({ type: LEAVE_BOARD });
