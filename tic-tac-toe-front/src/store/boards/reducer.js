import {MOVE_MADE, PLAYER_JOINED} from "./actions";

const defaultBoard = {
  id: '@DEFAULT',
  moves: [],
  players: []
};

const initialState = { entities: { [defaultBoard.id]: defaultBoard } };

export default function(state = initialState, action) {
  const updateBoard = (boardId, mapper) => {
    const board = state.entities[action.payload.boardId];
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

    default:
      return state
  }
}