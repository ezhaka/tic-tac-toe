import { filter, map, take } from "rxjs/operators/index";
import { LOCATION_CHANGE } from "connected-react-router";
import { concat } from "rxjs";

export function observeLocations(actions, states) {
  return concat(
    states.pipe(
      take(1),
      map(({ router }) => router.location)
    ),
    actions.pipe(
      filter(({ type }) => type === LOCATION_CHANGE),
      map(({ payload }) => payload.location)
    )
  );
}
