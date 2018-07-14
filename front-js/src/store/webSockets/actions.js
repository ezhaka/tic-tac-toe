export const WEB_SOCKET_CONNECTION_CLOSED = "WEB_SOCKET_CONNECTION_CLOSED";
export const WEB_SOCKET_CONNECTION_OPENED = "WEB_SOCKET_CONNECTION_OPENED";
export const SEND_WEB_SOCKET_MESSAGE = "SEND_WEB_SOCKET_MESSAGE";

export const webSocketConnectionClosed = error => ({
  type: WEB_SOCKET_CONNECTION_CLOSED,
  error
});
export const webSocketConnectionOpened = () => ({
  type: WEB_SOCKET_CONNECTION_OPENED
});
export const sendMessage = payload => ({
  type: SEND_WEB_SOCKET_MESSAGE,
  payload
});
