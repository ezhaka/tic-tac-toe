import React, { Component } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import Emoji from "./Emoji/Emoji";
import "./BoardCell.scss";
import selectors from "../store/boards/selectors";

export const ACTIVE_CELL = "ACTIVE_CELL";
export const WINNER_CELL = "WINNER_CELL";
export const LOSER_CELL = "LOSER_CELL";

class BoardCell extends Component {
  handleClick = () => {
    const { clickable, onClick, coordinates } = this.props;

    if (!clickable) {
      return;
    }

    onClick(coordinates);
  };

  render() {
    const { coordinates, iconType, cellState, clickable } = this.props;

    const className = classNames("board-cell", { clickable });

    return (
      <td
        key={coordinates.column}
        onClick={this.handleClick}
        className={className}
      >
        <div className="board-cell-content">
          <div className="board-icon-container">
            {iconType && (
              <Emoji type={iconType} inactive={cellState === LOSER_CELL} />
            )}
          </div>
        </div>
      </td>
    );
  }
}

const mapStateToProps = (state, { boardId, iconType }) => {
  const wonPlayer = selectors.getWonPlayer(state, boardId);
  return {
    clickable:
      !wonPlayer && !iconType && selectors.isActivePlayer(state, boardId)
  };
};

export default connect(mapStateToProps)(BoardCell);
