import {
  WEB_SOCKET_CONNECTION_CLOSED,
  WEB_SOCKET_CONNECTION_OPENED
} from "./actions";

export default function(state = {}, action) {
  switch (action.type) {
    case WEB_SOCKET_CONNECTION_CLOSED:
      return { connectionState: "CLOSED" };
    case WEB_SOCKET_CONNECTION_OPENED:
      return { connectionState: "OPENED" };
    default:
      return state;
  }
}
