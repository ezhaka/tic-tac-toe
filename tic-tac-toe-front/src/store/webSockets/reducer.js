import {REPORT_WEB_SOCKET_ERROR} from "./actions";

export default function (state = {}, action) {
  switch (action.type) {
    // TODO: как выйти из этого состояния?
    case REPORT_WEB_SOCKET_ERROR:
      return { connectionState: 'DISCONNECTED' }
    default:
      return state
  }
}