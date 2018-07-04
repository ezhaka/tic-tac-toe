export const REPORT_WEB_SOCKET_ERROR = 'REPORT_WEB_SOCKET_ERROR'
export const SEND_WEB_SOCKET_MESSAGE = 'SEND_WEB_SOCKET_MESSAGE'

export const reportError = error => ({ type: REPORT_WEB_SOCKET_ERROR, error })
export const sendMessage = payload => ({ type: SEND_WEB_SOCKET_MESSAGE, payload })
