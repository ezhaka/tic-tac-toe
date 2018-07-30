import { fromRoot } from "../../../utils/globalizeSelectors";

const globalize = fromRoot(["boards", "boardCreation"]);

export default {
  getStatus: globalize(state => state.status)
};
