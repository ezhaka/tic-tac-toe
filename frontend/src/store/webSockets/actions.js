// TODO: it shouldn't be here
export const INITIALIZE = "INITIALIZE";
export const INITIALIZATION_FAILED = "INITIALIZATION_FAILED";
export const INITIALIZATION_SUCCESSFUL = "INITIALIZATION_SUCCESSFUL";

export const OPEN_WEB_SOCKET_CONNECTION = "OPEN_WEB_SOCKET_CONNECTION";

export const WEB_SOCKET_CONNECTION_CLOSED = "WEB_SOCKET_CONNECTION_CLOSED";
export const WEB_SOCKET_CONNECTION_OPENED = "WEB_SOCKET_CONNECTION_OPENED";
export const SEND_WEB_SOCKET_MESSAGE = "SEND_WEB_SOCKET_MESSAGE";

export const openWebSocketConnection = () => ({
  type: OPEN_WEB_SOCKET_CONNECTION
});

export const webSocketConnectionClosed = error => ({
  type: WEB_SOCKET_CONNECTION_CLOSED,
  error
});

export const webSocketConnectionOpened = () => ({
  type: WEB_SOCKET_CONNECTION_OPENED
});
