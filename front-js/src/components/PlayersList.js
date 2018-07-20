import React from "react";
import { connect } from "react-redux";
import selectors from "../store/boards/selectors";
import Player from "./Player";

function PlayersList({ players }) {
  return (
    <ul>
      {players.map(player => (
        <li key={player.user.id}>
          <Player player={player} />
        </li>
      ))}
    </ul>
  );
}

const mapStateToProps = (state, { boardId }) => {
  const board = selectors.getBoardById(state, boardId);
  return {
    players: board.players
  };
};

export default connect(mapStateToProps)(PlayersList);
