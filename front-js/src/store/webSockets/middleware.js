import { WebSocketSubject } from 'rxjs/webSocket'
import { retryWhen, repeat } from 'rxjs/operators'
import {webSocketConnectionClosed, SEND_WEB_SOCKET_MESSAGE, webSocketConnectionOpened} from "./actions";

let socket;

function init(dispatch) {
  socket = new WebSocketSubject({
    url: 'ws://' + window.location.host + '/websocket',
    openObserver: {
      next: m => {
        dispatch(webSocketConnectionOpened())
        console.log('open next', m)
      }
    },
    closeObserver: {
      next: m => {
        dispatch(webSocketConnectionClosed())
        console.log('close next', m)
      }
    },
    closingObserver: {
      next: m => console.log('closing next', m)
    }
  });

  socket
    .pipe(
      retryWhen(errors => errors),
      repeat()
    )
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