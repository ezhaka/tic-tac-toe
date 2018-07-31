import React from "react";
import { connect } from "react-redux";
import { sortBy } from "lodash";
import Box from "grommet/components/Box";
import selectors from "../store/boards/selectors";
import Player from "./Player";
import authSelectors from "../store/authentication/selectors";

function PlayersList({ boardId, players }) {
  return (
    <Box pad={{ vertical: "small" }}>
      {players.map(player => (
        <Player
          key={player.user.id}
          player={player}
          boardId={boardId}
          listItem
        />
      ))}
    </Box>
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
