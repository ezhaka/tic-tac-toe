import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import webSocketMiddleware from "./webSockets/middleware";
import boardsReducer from './boards/reducer'
import webSocketsReducer from './webSockets/reducer'
import boardsEpic from './boards/epics'

export default function configureStore(initialState = {}) {
  const rootReducer = combineReducers({
    boards: boardsReducer,
    webSockets: webSocketsReducer
  })

  const rootEpic = combineEpics(
    boardsEpic
  );

  const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const epicMiddleware = createEpicMiddleware();

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware, webSocketMiddleware))
  );

  epicMiddleware.run(rootEpic)

  return store
}