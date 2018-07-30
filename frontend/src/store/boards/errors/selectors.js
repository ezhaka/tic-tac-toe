import { fromRoot } from "../../../utils/globalizeSelectors";

const globalize = fromRoot(["boards", "errors"]);

export default {
  isUnableToCreateBoard: globalize(state => state.unableToCreateBoard)
};
