import { combineEpics } from "redux-observable";
import { concat, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { filter, map, flatMap, delay, catchError } from "rxjs/operators";
import {
  openWebSocketConnection,
  INITIALIZE,
  INITIALIZATION_FAILED,
  WEB_SOCKET_CONNECTION_CLOSED,
  WEB_SOCKET_CONNECTION_OPENED
} from "./actions";
import { boardListLoaded } from "../boards/actions";
import { authenticated } from "../authentication/actions";

function authenticate() {
  return ajax.post(`/api/auth`).pipe(
    map(r => r.response),
    map(user => authenticated(user))
  );
}

function loadBoards() {
  return ajax(`/api/boards`).pipe(
    map(r => r.response),
    map(boards => boardListLoaded(boards))
  );
}

export default combineEpics(
  actions =>
    actions.pipe(
      filter(action => action.type === INITIALIZE),
      flatMap(() =>
        concat(authenticate(), of(openWebSocketConnection())).pipe(
          catchError(error => {
            console.error("Initialization error", error);
            return of({ type: INITIALIZATION_FAILED });
          })
        )
      )
    ),
  actions =>
    actions.pipe(
      filter(action => action.type === WEB_SOCKET_CONNECTION_OPENED),
      flatMap(() => loadBoards())
    ),
  actions =>
    actions.pipe(
      filter(
        action =>
          action.type === WEB_SOCKET_CONNECTION_CLOSED ||
          action.type === INITIALIZATION_FAILED
      ),
      delay(1000),
      map(() => ({ type: INITIALIZE }))
    )
);
