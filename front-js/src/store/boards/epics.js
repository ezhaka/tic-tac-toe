import {boardListLoaded, boardLoaded, CREATE_BOARD, joinBoard, LOAD_BOARD, LOAD_BOARD_LIST} from "./actions";
import {ajax} from 'rxjs/ajax';
import {of, EMPTY, throwError, concat} from 'rxjs'
import {map, filter, flatMap, catchError, ignoreElements, tap} from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { push } from 'connected-react-router'

export default combineEpics(
  (actions, state) => actions.pipe(
    filter(action => action.type === LOAD_BOARD),
    flatMap(action => ajax(`/api/boards/${action.boardId}`)),
    map(r => r.response),
    flatMap(board => of(boardLoaded(board), joinBoard(board.id)))
  ),
  (actions, state) => actions.pipe(
    filter(action => action.type === CREATE_BOARD),
    flatMap(action => ajax.post(`/api/boards`, {}, {'Content-Type': 'application/json'})),
    map(r => r.response),
    flatMap(board => of(boardLoaded(board), push(`/boards/${board.id}`))) // TODO: возможно, нужен более специфичный экшн
  ),
  (actions, state) => actions.pipe(
    filter(action => action.type === LOAD_BOARD_LIST),
    flatMap(action => ajax(`/api/boards`)),
    map(r => r.response), // TODO: избавиться от копипаста загрузки контента на определённый экшн
    map(boards => boardListLoaded(boards))
  ),
  (actions, state) => actions.pipe(
    tap(a => console.log(a)),
    flatMap(() => EMPTY)
  )
)
