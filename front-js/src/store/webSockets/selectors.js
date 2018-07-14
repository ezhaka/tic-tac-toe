import { fromRoot } from "../../utils/globalizeSelectors";

const globalize = fromRoot("webSockets");

export default {
  getConnectionState: globalize(state => state.connectionState)
};
