import { WebSocketSubject } from 'rxjs/webSocket'
import { retryWhen } from 'rxjs/operators'
import {reportError, SEND_WEB_SOCKET_MESSAGE} from "./actions";
import {tap} from "rxjs/operators";

let socket;

function init(dispatch) {
  socket = new WebSocketSubject('ws://' + window.location.host + '/websocket');

  socket
    .pipe(retryWhen(
      errors => errors.pipe(tap(e => dispatch(reportError(e))))
    ))
    .subscribe({
      next(value) {
        dispatch({type: value.type, payload: value})
      },
      complete() {
        // TODO: remove
        console.log('websocket completed')
      }
    })
}

export default store => next => action => {
  if (!socket) {
    init(store.dispatch)
  }

  if (action.type === SEND_WEB_SOCKET_MESSAGE) {
    socket.next(action.payload)
  }

  return next(action)
}