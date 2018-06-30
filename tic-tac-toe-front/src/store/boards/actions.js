import {SEND_WEB_SOCKET_MESSAGE} from "../webSockets/actions";

export const PLAYER_JOINED = 'PLAYER_JOINED'
export const MOVE_MADE = 'MOVE_MADE'

export const makeMove = (boardId, coordinates) => ({
  type: SEND_WEB_SOCKET_MESSAGE,
  payload: { type: 'MAKE_MOVE', boardId, coordinates }
})

export const joinBoard = (boardId) => ({
  type: SEND_WEB_SOCKET_MESSAGE,
  payload: { type: 'JOIN_BOARD', boardId }
})
