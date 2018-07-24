import { ajax } from "rxjs/ajax";
import { of } from "rxjs";
import { map, filter, flatMap } from "rxjs/operators";
import { combineEpics } from "redux-observable";
import { push } from "connected-react-router";
import { CREATE_BOARD } from "./actions";

export default combineEpics(actions =>
  actions.pipe(
    filter(action => action.type === CREATE_BOARD),
    flatMap(() =>
      ajax.post(`/api/boards`, {}, { "Content-Type": "application/json" })
    ),
    map(r => r.response),
    flatMap(board => of(push(`/boards/${board.id}`))) // TODO: возможно, нужен более специфичный экшн
  )
);
