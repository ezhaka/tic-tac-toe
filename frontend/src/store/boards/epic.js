import { ajax } from "rxjs/ajax";
import { map, filter, flatMap, skip, catchError } from "rxjs/operators";
import { combineEpics } from "redux-observable";
import { matchPath } from "react-router-dom";
import { of, concat, EMPTY } from "rxjs";
import {
  finishedBoardLoaded,
  enterBoard,
  joinBoard,
  leaveBoard
} from "./actions";
import { observeLocations } from "../../utils/epicUtils";
import selectors from "./selectors";
import { changeBoardPageStatus } from "./boardPage/actions";
import { statuses } from "./boardPage/reducer";
import boardCreationEpic from "./boardCreation/epic";

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

const mapError = error =>
  of(changeBoardPageStatus(error.status ? statuses.ERROR_404 : statuses.ERROR));

export default combineEpics(
  boardCreationEpic,

  (action$, state$) =>
    observeLocations(action$, state$).pipe(
      map(matchLocation("/boards/:id")),
      filter(match => match && match.isExact),
      flatMap(({ params }) =>
        loadBoard(state$.value, params.id).pipe(
          flatMap(({ board, isFromStore }) =>
            concat(
              isFromStore ? EMPTY : of(finishedBoardLoaded(board)),
              of(enterBoard(board.id)),
              board.winner ? EMPTY : of(joinBoard(board.id))
            )
          ),
          catchError(mapError)
        )
      )
    ),

  (action$, state$) =>
    observeLocations(action$, state$).pipe(
      skip(1), // we do not want LEAVE_BOARD to be dispatched on initialization
      map(matchLocation("/")),
      filter(match => match && match.isExact),
      map(() => leaveBoard())
    )
);
