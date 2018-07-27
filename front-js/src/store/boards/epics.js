import { ajax } from "rxjs/ajax";
import { map, filter, flatMap, skip } from "rxjs/operators";
import { combineEpics } from "redux-observable";
import { push } from "connected-react-router";
import { matchPath } from "react-router-dom";
import { CREATE_BOARD, enterBoard, leaveBoard } from "./actions";
import { observeLocations } from "../../utils/epicUtils";

const matchLocation = path => location =>
  matchPath(location.pathname, { path });

export default combineEpics(
  actions =>
    actions.pipe(
      filter(({ type }) => type === CREATE_BOARD),
      flatMap(() =>
        ajax.post(`/api/boards`, {}, { "Content-Type": "application/json" })
      ),
      map(r => r.response),
      map(board => push(`/boards/${board.id}`))
    ),
  (actions, states) =>
    observeLocations(actions, states).pipe(
      map(matchLocation("/boards/:id")),
      filter(match => match && match.isExact),
      map(({ params }) => enterBoard(params.id))
    ),
  (actions, states) =>
    observeLocations(actions, states).pipe(
      skip(1),
      map(matchLocation("/")),
      filter(match => match && match.isExact),
      map(() => leaveBoard())
    )
);
