import React, { Component } from "react";
import CircleQuestionIcon from "grommet/components/icons/base/CircleQuestion";
import Anchor from "grommet/components/Anchor";
import Tip from "grommet/components/Tip";
import "./HowToPlayAnchor.scss";

export default class HowToPlayAnchor extends Component {
  state = { showTooltip: false };

  handleClick = () => {
    this.setState({ showTooltip: true });
  };

  handleClose = () => {
    // setTimeout is necessary because we cannot guarantee that the Anchor won't have handler on the same click event
    // (see Anchor#onClick below). Without setTimeout, handleClick will very likely be called on the same click,
    // that will lead us to double handling handleClose -> handleClick, and tooltip will not be closed.
    setTimeout(() => this.setState({ showTooltip: false }));
  };

  render() {
    return (
      <div>
        {this.state.showTooltip && (
          <Tip target="how-to-play-anchor" onClose={this.handleClose}>
            <span>
              The first player to draw <b>4</b> of his or her symbols in a row,
              whether it is horizontal, vertical, or diagonal, has won.
            </span>
          </Tip>
        )}
        <Anchor
          id="how-to-play-anchor"
          className="how-to-play-anchor"
          icon={<CircleQuestionIcon />}
          label="how to play"
          // We do not want any handler when tooltip is shown, because Grommet will call handleClose automatically
          // when the Anchor is clicked. If handler is always present, we won't be able to close Tip by clicking Anchor,
          // because it will trigger double event handleClose -> handleClick.
          onClick={!this.state.showTooltip ? this.handleClick : undefined}
        />
      </div>
    );
  }
}
