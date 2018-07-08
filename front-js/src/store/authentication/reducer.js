import {AUTHENTICATED} from "./actions";

export default function(state = {}, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return { currentUser: action.user }
    default:
      return state
  }
}