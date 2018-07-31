import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";
import Emoji from "./Emoji/Emoji";
import authSelectors from "../store/authentication/selectors";
import "./Player.scss";
import boardSelectors from "../store/boards/selectors";

function Player({ player, isCurrentUser, isLoser, listItem }) {
  return (
    <span className={classNames("player", listItem && "list-item")}>
      <span className="player-icon">
        <Emoji type={player.iconType} size="24px" inactive={isLoser} />{" "}
      </span>
      <span>
        {player.user.name} {isCurrentUser && <span className="you">(you)</span>}
      </span>
    </span>
  );
}

const mapStateToProps = (state, { player, boardId }) => ({
  isCurrentUser: authSelectors.getCurrentUser(state).id === player.user.id,
  isLoser: boardSelectors.isLoser(state, boardId, player.user.id)
});

export default connect(mapStateToProps)(Player);
