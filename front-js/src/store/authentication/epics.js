import {combineEpics} from "redux-observable";
import {boardLoaded, LOAD_BOARD, loadBoardList} from "../boards/actions";
import {filter, flatMap, map} from "rxjs/operators/index";
import {of} from "rxjs/index";
import {ajax} from "rxjs/ajax/index";
import { push } from 'connected-react-router'
import {AUTHENTICATE, authenticated} from './actions'

export default combineEpics(
  (actions, state) => actions.pipe(
    filter(action => action.type === AUTHENTICATE),
    flatMap(() => ajax.post(`/api/auth`)),
    map(r => r.response),
    flatMap(user => {
      return of(authenticated(user), loadBoardList())
    })
  ),
)