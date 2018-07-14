import { ajax } from "rxjs/ajax";
import { of, EMPTY } from "rxjs";
import { map, filter, flatMap, tap } from "rxjs/operators";
import { combineEpics } from "redux-observable";
import { push } from "connected-react-router";
import { boardListLoaded, CREATE_BOARD, LOAD_BOARD_LIST } from "./actions";

export default combineEpics(
  actions =>
    actions.pipe(
      filter(action => action.type === CREATE_BOARD),
      flatMap(() =>
        ajax.post(`/api/boards`, {}, { "Content-Type": "application/json" })
      ),
      map(r => r.response),
      flatMap(board => of(push(`/boards/${board.id}`))) // TODO: возможно, нужен более специфичный экшн
    ),
  actions =>
    actions.pipe(
      filter(action => action.type === LOAD_BOARD_LIST),
      flatMap(() => ajax(`/api/boards`)),
      map(r => r.response), // TODO: избавиться от копипаста загрузки контента на определённый экшн
      map(boards => boardListLoaded(boards))
    ),
  actions =>
    actions.pipe(
      tap(a => console.log(a)),
      flatMap(() => EMPTY)
    )
);
