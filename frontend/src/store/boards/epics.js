import { ajax } from "rxjs/ajax";
import { map, filter, flatMap, skip } from "rxjs/operators";
import { combineEpics } from "redux-observable";
import { push } from "connected-react-router";
import { matchPath } from "react-router-dom";
import { of, concat, EMPTY } from "rxjs";
import {
  boardLoaded,
  CREATE_BOARD,
  enterBoard,
  joinBoard,
  leaveBoard
} from "./actions";
import { observeLocations } from "../../utils/epicUtils";
import selectors from "./selectors";

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
        ajax.post(`/api/boards`, {}, { "Content-Type": "application/json" })
      ),
      map(r => r.response),
      // TODO: error handling!!
      map(board => push(`/boards/${board.id}`))
    ),
  (actions, states) =>
    observeLocations(actions, states).pipe(
      map(matchLocation("/boards/:id")),
      filter(match => match && match.isExact),
      flatMap(({ params }) => loadBoard(states.value, params.id)),
      flatMap(({ board, isFromStore }) =>
        concat(
          isFromStore ? EMPTY : of(boardLoaded(board)),
          of(enterBoard(board.id)),
          board.winner ? EMPTY : of(joinBoard(board.id))
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