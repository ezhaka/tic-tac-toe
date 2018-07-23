import React from "react";
import { connect } from "react-redux";
import { sortBy } from "lodash";
import selectors from "../store/boards/selectors";
import Player from "./Player";
import authSelectors from "../store/authentication/selectors";

function PlayersList({ players }) {
  return (
    <div>
      {players.map(player => (
        <div key={player.user.id}>
          <Player player={player} />
        </div>
      ))}
    </div>
  );
}

const mapStateToProps = (state, { boardId }) => {
  const board = selectors.getBoardById(state, boardId);
  const currentUser = authSelectors.getCurrentUser(state);
  const isCurrentUser = player => player.user.id === currentUser.id;

  return {
    players: sortBy(board.players, [p => (isCurrentUser(p) ? 0 : 1)])
  };
};

export default connect(mapStateToProps)(PlayersList);
