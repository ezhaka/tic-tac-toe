import { ajax } from "rxjs/ajax";
import { map, filter, flatMap, skip, catchError } from "rxjs/operators";
import { combineEpics } from "redux-observable";
import { push } from "connected-react-router";
import { matchPath } from "react-router-dom";
import { of, concat, EMPTY } from "rxjs";
import {
  finishedBoardLoaded,
  CREATE_BOARD,
  enterBoard,
  joinBoard,
  leaveBoard
} from "./actions";
import { observeLocations } from "../../utils/epicUtils";
import selectors from "./selectors";
import { changeBoardPageStatus } from "./boardPage/actions";
import status from "./status";
import { setUnableToCreateBoard } from "./errors/actions";

const matchLocation = path => location =>
  matchPath(location.pathname, { path });

const loadBoard = (state, boardId) => {
  const board = selectors.getBoardById(state, boardId);
  return board
    ? of({ board, isFromStore: true })
    : ajax
        .get(`/api/boards/${boardId}`)
        .pipe(map(r => ({ board: r.response })));
};

export default combineEpics(
  actions =>
    actions.pipe(
      filter(({ type }) => type === CREATE_BOARD),
      flatMap(() =>
        ajax
          .post(`/api/boards`, {}, { "Content-Type": "application/json" })
          .pipe(
            map(r => r.response),
            map(board => push(`/boards/${board.id}`)),
            catchError(() => of(setUnableToCreateBoard(true)))
          )
      )
    ),
  (actions, states) =>
    observeLocations(actions, states).pipe(
      map(matchLocation("/boards/:id")),
      filter(match => match && match.isExact),
      flatMap(({ params }) => loadBoard(states.value, params.id)),
      flatMap(({ board, isFromStore }) =>
        concat(
          isFromStore ? EMPTY : of(finishedBoardLoaded(board)),
          of(enterBoard(board.id)),
          board.winner ? EMPTY : of(joinBoard(board.id))
        )
      ),
      catchError(error =>
        of(
          changeBoardPageStatus(error.status ? status.ERROR_404 : status.ERROR)
        )
      )
    ),
  (actions, states) =>
    observeLocations(actions, states).pipe(
      skip(1), // we do not want LEAVE_BOARD to be dispatched on initialization
      map(matchLocation("/")),
      filter(match => match && match.isExact),
      map(() => leaveBoard())
    )
);
