import { fromRoot } from "../../utils/globalizeSelectors";

const globalize = fromRoot("authentication");

export default {
  getCurrentUser: globalize(state => state.currentUser)
};
