import {SEND_WEB_SOCKET_MESSAGE} from "../webSockets/actions";

export const PLAYER_JOINED = 'PLAYER_JOINED'
export const MOVE_MADE = 'MOVE_MADE'

export const CREATE_BOARD = 'CREATE_BOARD'
export const LOAD_BOARD = 'LOAD_BOARD'
export const BOARD_LOADED = 'BOARD_LOADED'
export const LOAD_BOARD_LIST = 'LOAD_BOARD_LIST'
export const BOARD_LIST_LOADED = 'BOARD_LIST_LOADED'

export const makeMove = (boardId, coordinates) => ({
  type: SEND_WEB_SOCKET_MESSAGE,
  payload: { type: 'MAKE_MOVE', boardId, coordinates }
})

export const joinBoard = boardId => ({
  type: SEND_WEB_SOCKET_MESSAGE,
  payload: { type: 'JOIN_BOARD', boardId }
})

export const createBoard = () => ({ type: CREATE_BOARD })
export const boardLoaded = board => ({ type: BOARD_LOADED, board })
export const loadBoard = boardId => ({ type: LOAD_BOARD, boardId })
export const loadBoardList = () => ({ type: LOAD_BOARD_LIST })
export const boardListLoaded = boards => ({ type: BOARD_LIST_LOADED, boards })