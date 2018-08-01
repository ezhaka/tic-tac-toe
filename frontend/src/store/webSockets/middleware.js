import { WebSocketSubject } from "rxjs/webSocket";
import {
  webSocketConnectionClosed,
  webSocketConnectionOpened,
  SEND_WEB_SOCKET_MESSAGE,
  OPEN_WEB_SOCKET_CONNECTION
} from "./actions";

let socket;

let pingTimer;

/**
 * We need fake messages sending, because heroku closes connection if it's idle for 55s
 * https://devcenter.heroku.com/articles/request-timeout#long-polling-and-streaming-responses
 */
function schedulePing() {
  clearTimeout(pingTimer);

  pingTimer = setTimeout(() => {
    socket.next({ type: "PING" });
    schedulePing();
  }, 50 * 1000);
}

function init(dispatch) {
  socket = new WebSocketSubject({
    url: `${(window.location.protocol === "https:" ? "wss://" : "ws://") +
      window.location.host}/websocket`,
    openObserver: {
      next: () => {
        dispatch(webSocketConnectionOpened());
        schedulePing();
      }
    }
  });

  socket.subscribe({
    next(value) {
      schedulePing();

      if (value.type !== "PONG") {
        dispatch(value);
      }
    },
    complete() {
      dispatch(webSocketConnectionClosed());
      clearTimeout(pingTimer);
    },
    error() {
      dispatch(webSocketConnectionClosed());
      clearTimeout(pingTimer);
    }
  });
}

export default store => next => action => {
  if (action.type === OPEN_WEB_SOCKET_CONNECTION) {
    init(store.dispatch);
  }

  if (action.type === SEND_WEB_SOCKET_MESSAGE) {
    socket.next(action.payload);
    schedulePing();
  }

  return next(action);
};
