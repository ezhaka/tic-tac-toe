import {boardLoaded, joinBoard, LOAD_BOARD} from "./actions";
import { ajax } from 'rxjs/ajax';
import { of, EMPTY, throwError, concat } from 'rxjs'
import { map, filter, flatMap, catchError, ignoreElements, tap } from 'rxjs/operators';

const defaultBoard = {
  id: '@DEFAULT',
  moves: [],
  players: []
};

export default (actions, state) => actions.pipe(
  filter(action => action.type === LOAD_BOARD),

  flatMap(action => concat(
    ajax.post(`/api/board`, JSON.stringify(defaultBoard), { 'Content-Type': 'application/json' }).pipe(
      catchError(e => e.status === 409 ? EMPTY : throwError(e)),
      ignoreElements()
    ),
    of(action)
  )),
  flatMap(action => ajax(`/api/board/${action.boardId}`)),
  map(r => r.response),
  flatMap(board => of(boardLoaded(board), joinBoard(board.id)))
)
