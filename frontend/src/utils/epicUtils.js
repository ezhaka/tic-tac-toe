import { filter, map, withLatestFrom, take } from "rxjs/operators/index";
import { LOCATION_CHANGE } from "connected-react-router";
import { concat } from "rxjs";
import { ofType } from "redux-observable";
import { INITIALIZATION_SUCCESSFUL } from "../store/initialzation/actions";

export function observeLocations(actions, states) {
  return concat(
    actions.pipe(
      ofType(INITIALIZATION_SUCCESSFUL),
      withLatestFrom(states),
      map(([, state]) => state.router.location),
      take(1)
    ),
    actions.pipe(
      filter(({ type }) => type === LOCATION_CHANGE),
      map(({ payload }) => payload.location)
    )
  );
}
