import {BOARD_CREATED, BOARD_LIST_LOADED, BOARD_LOADED, MOVE_MADE, PLAYER_JOINED, PLAYER_WON} from "./actions";
import {keyBy} from 'lodash'

const initialState = { entities: {} };

export default function(state = initialState, action) {
  const updateBoard = (boardId, mapper) => {
    const board = state.entities[boardId]; // TODO: это не круто, лучше разбить на разные редьюсеры
    return { entities: { ...state.entities, [boardId]: mapper(board) } }
  }

  switch (action.type) {
    case PLAYER_JOINED: {
      const { boardId, player } = action.payload
      return updateBoard(boardId, board => ({...board, players: [...board.players, player]}))
    }

    case MOVE_MADE: {
      const {boardId, move} = action.payload
      return updateBoard(boardId, board => ({...board, moves: [...board.moves, move]}))
    }

    case PLAYER_WON: {
      const {boardId, move, winner} = action.payload
      return updateBoard(boardId, board => ({...board, moves: [...board.moves, move], winner}))
    }

    case BOARD_LOADED:
      return updateBoard(action.board.id, () => action.board)

    case BOARD_CREATED:
      return updateBoard(action.payload.board.id, () => action.payload.board)

    case BOARD_LIST_LOADED:
      return { entities: keyBy(action.boards, board => board.id) }

    default:
      return state
  }
}