import {BOARD_LOADED, MOVE_MADE, PLAYER_JOINED} from "./actions";

const initialState = { entities: {} };

export default function(state = initialState, action) {
  const updateBoard = (boardId, mapper) => {
    const board = state.entities[boardId];
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

    case BOARD_LOADED:
      return updateBoard(action.board.id, () => action.board)

    default:
      return state
  }
}