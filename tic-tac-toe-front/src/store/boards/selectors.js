import globalizeSelectors from "../../utils/globalizeSelectors";

export default globalizeSelectors({
  getBoardById: (state, boardId) => {
    return state.entities[boardId]
  }
}, 'boards')