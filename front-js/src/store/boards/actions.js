import { SEND_WEB_SOCKET_MESSAGE } from "../webSockets/actions";

export const CREATE_BOARD = "CREATE_BOARD";

export const BOARD_CREATED = "BOARD_CREATED";
export const PLAYER_JOINED = "PLAYER_JOINED";
export const MOVE_MADE = "MOVE_MADE";
export const PLAYER_WON = "PLAYER_WON";
export const BOARD_LIST_LOADED = "BOARD_LIST_LOADED";

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
export const moveMade = (boardId, move) => ({ type: MOVE_MADE, boardId, move });
export const boardListLoaded = boards => ({ type: BOARD_LIST_LOADED, boards });
