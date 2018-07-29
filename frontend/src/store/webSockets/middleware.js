import { WebSocketSubject } from "rxjs/webSocket";
import {
  webSocketConnectionClosed,
  webSocketConnectionOpened,
  SEND_WEB_SOCKET_MESSAGE,
  OPEN_WEB_SOCKET_CONNECTION
} from "./actions";

let socket;

function init(dispatch) {
  socket = new WebSocketSubject({
    url: `${(window.location.protocol === "https:" ? "wss://" : "ws://") +
      window.location.host}/websocket`,
    openObserver: {
      next: () => dispatch(webSocketConnectionOpened())
    }
  });

  socket.subscribe({
    next(value) {
      dispatch(value);
    },
    complete() {
      dispatch(webSocketConnectionClosed());
    },
    error() {
      dispatch(webSocketConnectionClosed());
    }
  });
}

export default store => next => action => {
  if (action.type === OPEN_WEB_SOCKET_CONNECTION) {
    init(store.dispatch);
  }

  if (action.type === SEND_WEB_SOCKET_MESSAGE) {
    socket.next(action.payload);
  }

  return next(action);
};
