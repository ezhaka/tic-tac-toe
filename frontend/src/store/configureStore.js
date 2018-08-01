import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { ajax } from "rxjs/ajax";
import webSocketMiddleware from "./webSockets/middleware";
import boardsReducer from "./boards/reducer";
import webSocketsReducer from "./webSockets/reducer";
import authenticationReducer from "./authentication/reducer";
import boardsEpic from "./boards/epics";
import initializationEpic from "./initialzation/epics";

export const rootReducer = combineReducers({
  authentication: authenticationReducer,
  boards: boardsReducer,
  webSockets: webSocketsReducer
});

export default function configureStore(history) {
  const rootEpic = combineEpics(boardsEpic, initializationEpic);

  const composeEnhancers =
    // eslint-disable-next-line no-underscore-dangle
    (global && global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const epicMiddleware = createEpicMiddleware({
    dependencies: { ajax }
  });

  const middleware = applyMiddleware(
    epicMiddleware,
    webSocketMiddleware,
    routerMiddleware(history)
  );

  const store = createStore(
    history ? connectRouter(history)(rootReducer) : rootReducer,
    {},
    composeEnhancers(middleware)
  );

  epicMiddleware.run(rootEpic);

  return store;
}
