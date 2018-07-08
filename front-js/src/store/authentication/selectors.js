import globalizeSelectors, {fromRoot} from "../../utils/globalizeSelectors";
import {curry} from "lodash";

const globalize = fromRoot('authentication')

export default {
  getCurrentUser: globalize(state => state.currentUser)
}
