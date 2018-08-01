import { map, flatMap, catchError } from "rxjs/operators";
import { combineEpics, ofType } from "redux-observable";
import { push } from "connected-react-router";
import { of, concat } from "rxjs";
import {
  boardCreationFailed,
  boardCreationInProgress,
  boardCreationSuccessful,
  CREATE_BOARD
} from "./actions";

export default combineEpics((action$, state$, { ajax }) =>
  action$.pipe(
    ofType(CREATE_BOARD),
    flatMap(() =>
      concat(
        of(boardCreationInProgress()),
        ajax
          .post(`/api/boards`, {}, { "Content-Type": "application/json" })
          .pipe(
            map(r => r.response),
            flatMap(board =>
              of(push(`/boards/${board.id}`), boardCreationSuccessful())
            ),
            catchError(error => {
              // eslint-disable-next-line no-console
              console.error(error);
              return of(boardCreationFailed());
            })
          )
      )
    )
  )
);
