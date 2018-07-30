import { get } from "lodash";
import entitiesReducer from "./entities/reducer";
import initializationReducer from "./initialization/reducer";
import boardPageReducer from "./boardPage/reducer";
import errorsReducer from "./errors/reducer";

export default function(state = {}, action) {
  return {
    entities: entitiesReducer(
      state.entities,
      action,
      get(state, ["boardPage", "currentBoardId"]),
      state.initialization
    ),
    initialization: initializationReducer(state.initialization, action),
    boardPage: boardPageReducer(state.boardPage, action),
    errors: errorsReducer(state.errors, action)
  };
}
