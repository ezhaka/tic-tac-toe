import React from "react";
import { connect } from "react-redux";
import Label from "grommet/components/Label";
import selectors from "../store/boards/selectors";
import Player from "./Player";

const StatusString = ({
  boardId,
  isPlayer,
  isWinner,
  wonPlayer,
  isActivePlayer
}) => {
  let status = null;

  if (wonPlayer) {
    status = isWinner ? (
      <span>Congrats! You are the winner</span>
    ) : (
      <span>
        <Player player={wonPlayer} boardId={boardId} /> won
      </span>
    );
  } else if (!isPlayer) {
    status = <span>You are not joined to this board</span>;
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
  isPlayer: selectors.isPlayer(state, boardId),
  isActivePlayer: selectors.isActivePlayer(state, boardId),
  isWinner: selectors.hasCurrentUserWon(state, boardId),
  wonPlayer: selectors.getWonPlayer(state, boardId)
});

export default connect(mapStateToProps)(StatusString);
