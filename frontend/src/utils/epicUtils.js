import { map, withLatestFrom, take } from "rxjs/operators/index";
import { LOCATION_CHANGE } from "connected-react-router";
import { concat } from "rxjs";
import { ofType } from "redux-observable";
import { INITIALIZATION_SUCCESSFUL } from "../store/initialzation/actions";

export function observeLocations(action$, state$) {
  return concat(
    action$.pipe(
      ofType(INITIALIZATION_SUCCESSFUL),
      withLatestFrom(state$),
      map(([, state]) => state.router.location),
      take(1)
    ),
    action$.pipe(
      ofType(LOCATION_CHANGE),
      map(({ payload }) => payload.location)
    )
  );
}
