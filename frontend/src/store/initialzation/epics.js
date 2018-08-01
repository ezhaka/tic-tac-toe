import { combineEpics, ofType } from "redux-observable";
import { concat, of } from "rxjs";

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
  ACTIVE_BOARD_LIST_LOADED,
  activeBoardListLoaded,
  finishedBoardLoaded
} from "../boards/actions";

import { authenticated } from "../authentication/actions";
import selectors from "../boards/selectors";
import boardPageSelectors from "../boards/boardPage/selectors";
import { changeBoardPageStatus } from "../boards/boardPage/actions";
import { statuses } from "../boards/boardPage/reducer";

import {
  INITIALIZATION_FAILED,
  initializationFailed,
  initializationSuccessful,
  initialize,
  INITIALIZE
} from "./actions";

function authenticate(post) {
  return post(`/api/auth`).pipe(
    map(r => r.response),
    map(user => authenticated(user))
  );
}

function loadBoards(get) {
  return get("/api/boards").pipe(
    map(r => r.response),
    map(boards => activeBoardListLoaded(boards))
  );
}

/**
 * "Dirty" means "has non actual state". A board can become dirty in a following way:
 * 1. We are on the board page.
 * 2. Connection error occurred, which triggered reinitialization.
 * 3. Due to reinitialization we received new active boards list that doesn't contain
 *    the board which we are currently on. This means, somebody won the game while
 *    we were disconnected.
 * 4. We mark our board as dirty and request it's actual state.
 */
function reloadDirtyBoardEpic(actions, states, { ajax }) {
  const catchBoardFetchingError = catchError(error =>
    of(
      changeBoardPageStatus(error.status ? statuses.ERROR_404 : statuses.ERROR)
    )
  );

  return actions.pipe(
    ofType(ACTIVE_BOARD_LIST_LOADED),
    withLatestFrom(
      states.pipe(map(state => boardPageSelectors.getCurrentBoardId(state)))
    ),
    filter(([, currentBoardId]) => {
      const currentBoard = selectors.getBoardById(states.value, currentBoardId);
      return currentBoardId && currentBoard && currentBoard.dirty;
    }),
    flatMap(([, currentBoardId]) =>
      ajax.get(`/api/boards/${currentBoardId}`).pipe(
        map(r => r.response),
        map(board => finishedBoardLoaded(board)),
        catchBoardFetchingError
      )
    )
  );
}

export const catchInitializationFailure = catchError(error => {
  // eslint-disable-next-line no-console
  console.error("Initialization error", error);
  return of(initializationFailed());
});

/**
 * Correct initialization is needed in order to guarantee that no message
 * will be lost between snapshot (board list) loading and web socket
 * connection setup.
 *
 * It works in the following way:
 * - Request authentication.
 * - As soon as user is authenticated, begin web socket connection initialization.
 * - Once connection is initialized, we begin to receive messages. However, we
 *   don't have state (game boards) yet and can not apply the messages. We just
 *   store them in in separate collection named `pendingActions`.
 * - As soon as web socket connection opened, load all active game boards and dispatch
 *   ACTIVE_BOARD_LIST_LOADED action. As you may remember, we could have some pending messages.
 *   It's time to apply them to game boards. However, we should know somehow if a board
 *   has an action applied, in order to not apply the same message twice. Especially
 *   for this purpose, every board has `version` field and every message has `board version`
 *   one. Using this information, we can apply only those messages, which have greater
 *   version than a board.
 */
export default combineEpics(
  (actions, states, { ajax }) =>
    actions.pipe(
      ofType(INITIALIZE),
      flatMap(() =>
        concat(authenticate(ajax.post), of(openWebSocketConnection())).pipe(
          catchInitializationFailure
        )
      )
    ),

  (actions, states, { ajax }) =>
    actions.pipe(
      ofType(WEB_SOCKET_CONNECTION_OPENED),
      flatMap(() =>
        concat(loadBoards(ajax.get), of(initializationSuccessful())).pipe(
          catchInitializationFailure
        )
      )
    ),

  actions =>
    actions.pipe(
      ofType(WEB_SOCKET_CONNECTION_CLOSED, INITIALIZATION_FAILED),
      delay(1000),
      map(() => initialize())
    ),

  reloadDirtyBoardEpic
);
