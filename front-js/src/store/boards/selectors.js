import globalizeSelectors, {fromRoot} from "../../utils/globalizeSelectors";
import {values, curry, last, find} from 'lodash'
import authSelectors from "../authentication/selectors";

const globalize = fromRoot('boards')

export default {
  getBoardById: globalize((state, boardId) => {
    return state.entities[boardId]
  }),
  getAllBoards: globalize((state) => {
    return values(state.entities)
  }),
  isActivePlayer(state, boardId) {
    const currentUser = authSelectors.getCurrentUser(state)
    const board = this.getBoardById(state, boardId)

    if (!board) {
      return false
    }

    let lastMove = last(board.moves);
    return !lastMove || lastMove.userId !== currentUser.id
  },
  isWinner(state, boardId) {
    const currentUser = authSelectors.getCurrentUser(state)
    const board = this.getBoardById(state, boardId)

    if (!board || !board.winner) {
      return false
    }

    return board.winner.userId === currentUser.id
  },
  getWonPlayer(state, boardId) {
    const board = this.getBoardById(state, boardId)

    if (!board || !board.winner) {
      return null
    }

    return find(board.players, p => p.user.id === board.winner.userId)
  }
}
