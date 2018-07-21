import React, { Component } from "react";
import Emoji from "./Emoji/Emoji";

export const ACTIVE_CELL = "ACTIVE_CELL";
export const WINNER_CELL = "WINNER_CELL";
export const LOSER_CELL = "LOSER_CELL";

export default class BoardCell extends Component {
  handleClick = () => {
    const { onClick, coordinates } = this.props;
    onClick(coordinates);
  };

  render() {
    const { coordinates, iconType, cellState } = this.props;
    const className = `board-cell ${cellState
      .replace("_CELL", "")
      .toLowerCase()}`;

    return (
      <td
        key={coordinates.column}
        onClick={this.handleClick}
        className={className}
      >
        <div className="board-cell-content">
          <div className="board-icon-container">
            {iconType && <Emoji type={iconType} />}
          </div>
        </div>
      </td>
    );
  }
}
