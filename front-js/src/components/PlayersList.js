import React from 'react';
import Emoji from "./Emoji";
import selectors from "../store/boards/selectors";
import {connect} from "react-redux";

function PlayersList({players}) {
  return <ul>
    {players.map(player => <li key={player.user.id}>
        <Emoji type={player.iconType}/> {player.user.name}
      </li>
    )}
  </ul>
}

const mapStateToProps = (state, {boardId}) => {
  const board = selectors.getBoardById(state, boardId);
  return {
    players: board.players
  }
}

export default connect(mapStateToProps)(PlayersList)