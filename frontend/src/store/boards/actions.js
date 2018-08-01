import { SEND_WEB_SOCKET_MESSAGE } from "../webSockets/actions";

export const BOARD_CREATED = "BOARD_CREATED";
export const PLAYER_JOINED = "PLAYER_JOINED";
export const MOVE_MADE = "MOVE_MADE";
export const PLAYER_WON = "PLAYER_WON";
export const FINISHED_BOARD_LOADED = "FINISHED_BOARD_LOADED";
export const ACTIVE_BOARD_LIST_LOADED = "ACTIVE_BOARD_LIST_LOADED";

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

export const boardCreated = board => ({ type: BOARD_CREATED, board });

export const moveMade = (boardId, userId, row, column, boardVersion) => ({
  type: MOVE_MADE,
  boardId,
  boardVersion,
  move: {
    userId,
    coordinates: {
      row,
      column
    }
  }
});

export const playerWonMessage = (boardId, move, winner, boardVersion) => ({
  type: PLAYER_WON,
  boardId,
  boardVersion,
  move,
  winner
});

export const finishedBoardLoaded = board => ({
  type: FINISHED_BOARD_LOADED,
  board
});

export const activeBoardListLoaded = boards => ({
  type: ACTIVE_BOARD_LIST_LOADED,
  boards
});

export const enterBoard = boardId => ({ type: ENTER_BOARD, boardId });

export const leaveBoard = () => ({ type: LEAVE_BOARD });

export const playerJoined = (boardId, player, boardVersion) => ({
  type: PLAYER_JOINED,
  boardId,
  boardVersion,
  player
});
