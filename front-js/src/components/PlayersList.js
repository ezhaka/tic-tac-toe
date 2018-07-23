import React from "react";
import { connect } from "react-redux";
import selectors from "../store/boards/selectors";
import Player from "./Player";

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
  return {
    players: board.players
  };
};

export default connect(mapStateToProps)(PlayersList);
