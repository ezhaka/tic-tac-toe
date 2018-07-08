import globalizeSelectors, {fromRoot} from "../../utils/globalizeSelectors";
import {values, curry, last} from 'lodash'
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
    const user = authSelectors.getCurrentUser(state)
    const board = this.getBoardById(state, boardId)

    if (!board) {
      return false
    }

    let lastMove = last(board.moves);
    return !lastMove || lastMove.userId !== user.id
  }
}
