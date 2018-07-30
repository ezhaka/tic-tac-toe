import { get } from "lodash";
import entitiesReducer from "./entities/reducer";
import initializationReducer from "./initialization/reducer";
import boardPageReducer from "./boardPage/reducer";
import boardCreationReducer from "./boardCreation/reducer";

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
    boardCreation: boardCreationReducer(state.boardCreation, action)
  };
}
