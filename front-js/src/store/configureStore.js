import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { connectRouter, routerMiddleware } from "connected-react-router";
import webSocketMiddleware from "./webSockets/middleware";
import boardsReducer from "./boards/reducer";
import webSocketsReducer from "./webSockets/reducer";
import authenticationReducer from "./authentication/reducer";
import boardsEpic from "./boards/epics";
import webSocketsEpic from "./webSockets/epics";

export default function configureStore(history) {
  const rootReducer = combineReducers({
    authentication: authenticationReducer,
    boards: boardsReducer,
    webSockets: webSocketsReducer
  });

  const rootEpic = combineEpics(boardsEpic, webSocketsEpic);

  const composeEnhancers =
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const epicMiddleware = createEpicMiddleware();

  const store = createStore(
    connectRouter(history)(rootReducer),
    {},
    composeEnhancers(
      applyMiddleware(
        epicMiddleware,
        webSocketMiddleware,
        routerMiddleware(history)
      )
    )
  );

  epicMiddleware.run(rootEpic);

  return store;
}
