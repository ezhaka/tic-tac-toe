import React from "react";
import { connect } from "react-redux";
import Label from "grommet/components/Label";
import selectors from "../store/boards/selectors";
import Player from "./Player";

const StatusString = ({ wonPlayer, isWinner, isActivePlayer }) => {
  let status = null;

  if (wonPlayer) {
    status = isWinner ? (
      <span>Congrats! You are the winner</span>
    ) : (
      <span>
        Sorry, <Player player={wonPlayer} /> won
      </span>
    );
  } else {
    status = isActivePlayer ? (
      <span>Your turn!</span>
    ) : (
      <span>Waiting for other players to make a move</span>
    );
  }

  return <Label align="center">{status}</Label>;
};

const mapStateToProps = (state, { boardId }) => ({
  isActivePlayer: selectors.isActivePlayer(state, boardId),
  isWinner: selectors.isWinner(state, boardId),
  wonPlayer: selectors.getWonPlayer(state, boardId)
});

export default connect(mapStateToProps)(StatusString);
