import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import webSocketMiddleware from "./webSockets/middleware";
import boards from './boards/reducer'
import webSockets from './webSockets/reducer'

export default function configureStore(initialState = {}) {
  const reducers = combineReducers({
    boards,
    webSockets
  })

  const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
  return createStore(reducers, initialState, composeEnhancers(applyMiddleware(webSocketMiddleware)))
}