import React from "react";
import { connect } from "react-redux";
import Emoji from "./Emoji/Emoji";
import authSelectors from "../store/authentication/selectors";
import "./Player.scss";

function Player({ player, isCurrentUser }) {
  // TODO: do not hardcode icon size
  return (
    <span className="player">
      <Emoji type={player.iconType} size="22px" /> {player.user.name}{" "}
      {isCurrentUser && <span className="you">(you)</span>}
    </span>
  );
}

const mapStateToProps = (state, { player }) => ({
  isCurrentUser: authSelectors.getCurrentUser(state).id === player.user.id
});

export default connect(mapStateToProps)(Player);
