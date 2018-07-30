import { combineEpics } from "redux-observable";
import { concat, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  filter,
  map,
  flatMap,
  delay,
  catchError,
  withLatestFrom
} from "rxjs/operators";
import {
  openWebSocketConnection,
  WEB_SOCKET_CONNECTION_CLOSED,
  WEB_SOCKET_CONNECTION_OPENED
} from "../webSockets/actions";
import {
  BOARD_LIST_LOADED,
  boardListLoaded,
  finishedBoardLoaded
} from "../boards/actions";
import { authenticated } from "../authentication/actions";
import selectors from "../boards/selectors";
import { changeBoardPageStatus } from "../boards/boardPage/actions";
import {
  INITIALIZATION_FAILED,
  initializationFailed,
  initializationSuccessful,
  initialize,
  INITIALIZE
} from "./actions";
import { statuses } from "../boards/boardPage/reducer";

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
      filter(({ type }) => type === INITIALIZE),
      flatMap(() =>
        concat(authenticate(), of(openWebSocketConnection())).pipe(
          catchError(error => {
            // eslint-disable-next-line no-console
            console.error("Initialization error", error);
            return of(initializationFailed());
          })
        )
      )
    ),

  actions =>
    actions.pipe(
      filter(({ type }) => type === WEB_SOCKET_CONNECTION_OPENED),
      flatMap(() => concat(loadBoards(), of(initializationSuccessful())))
    ),

  actions =>
    actions.pipe(
      filter(
        ({ type }) =>
          type === WEB_SOCKET_CONNECTION_CLOSED ||
          type === INITIALIZATION_FAILED
      ),
      delay(1000),
      map(() => initialize())
    ),

  (actions, states) =>
    actions.pipe(
      filter(({ type }) => type === BOARD_LIST_LOADED),
      withLatestFrom(
        states.pipe(map(state => selectors.getCurrentBoardId(state)))
      ),
      filter(([, currentBoardId]) => {
        const currentBoard = selectors.getBoardById(
          states.value,
          currentBoardId
        );

        return currentBoardId && currentBoard && currentBoard.dirty;
      }),
      flatMap(([, currentBoardId]) =>
        ajax.get(`/api/boards/${currentBoardId}`).pipe(
          catchError(error =>
            of(
              changeBoardPageStatus(
                error.status ? statuses.ERROR_404 : statuses.ERROR
              )
            )
          ),
          map(r => r.response),
          map(board => finishedBoardLoaded(board))
        )
      )
    )
);
