import { sortBy, values, last, find } from "lodash";
import { fromRoot } from "../../utils/globalizeSelectors";
import authSelectors from "../authentication/selectors";

const globalize = fromRoot("boards");

export default {
  getBoardById: globalize((state, boardId) => state.entities[boardId]),
  getAllBoards: globalize(state => values(state.entities)),
  getActiveBoards: globalize(state =>
    sortBy(values(state.entities).filter(b => !b.winner), b => -b.id)
  ),
  isActivePlayer(state, boardId) {
    const currentUser = authSelectors.getCurrentUser(state);
    const board = this.getBoardById(state, boardId);

    if (!board) {
      return false;
    }

    const lastMove = last(board.moves);
    return !lastMove || lastMove.userId !== currentUser.id;
  },
  isWinner(state, boardId) {
    const currentUser = authSelectors.getCurrentUser(state);
    const board = this.getBoardById(state, boardId);

    if (!board || !board.winner) {
      return false;
    }

    return board.winner.userId === currentUser.id;
  },
  getWonPlayer(state, boardId) {
    const board = this.getBoardById(state, boardId);

    if (!board || !board.winner) {
      return null;
    }

    return find(board.players, p => p.user.id === board.winner.userId);
  }
};
