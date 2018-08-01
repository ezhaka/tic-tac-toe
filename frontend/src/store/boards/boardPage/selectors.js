import { fromRoot } from "../../../utils/globalizeSelectors";

const globalize = fromRoot(["boards", "boardPage"]);

export default {
  getStatus: globalize(state => state.status),
  getCurrentBoardId: globalize(state => state.currentBoardId)
};
