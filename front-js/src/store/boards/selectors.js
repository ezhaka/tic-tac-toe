import globalizeSelectors from "../../utils/globalizeSelectors";
import { values } from 'lodash'

export default globalizeSelectors({
  getBoardById: (state, boardId) => {
    return state.entities[boardId]
  },
  getAllBoards: (state) => {
    return values(state.entities)
  }
}, 'boards')