import { combineEpics } from "redux-observable";
import { filter, flatMap, map } from "rxjs/operators/index";
import { of } from "rxjs/index";
import { ajax } from "rxjs/ajax/index";
import { loadBoardList } from "../boards/actions";
import { AUTHENTICATE, authenticated } from "./actions";

export default combineEpics(actions =>
  actions.pipe(
    filter(action => action.type === AUTHENTICATE),
    flatMap(() => ajax.post(`/api/auth`)),
    map(r => r.response),
    flatMap(user => of(authenticated(user), loadBoardList()))
  )
);
