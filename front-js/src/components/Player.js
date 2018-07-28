import React from "react";
import { connect } from "react-redux";
import Emoji from "./Emoji/Emoji";
import authSelectors from "../store/authentication/selectors";
import "./Player.scss";
import boardSelectors from "../store/boards/selectors";

function Player({ player, isCurrentUser, isLoser }) {
  return (
    <span className="player">
      <Emoji type={player.iconType} size="1em" inactive={isLoser} />{" "}
      {player.user.name} {isCurrentUser && <span className="you">(you)</span>}
    </span>
  );
}

const mapStateToProps = (state, { player, boardId }) => ({
  isCurrentUser: authSelectors.getCurrentUser(state).id === player.user.id,
  isLoser: boardSelectors.isLoser(state, boardId, player.user.id)
});

export default connect(mapStateToProps)(Player);
