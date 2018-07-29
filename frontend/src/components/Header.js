import React from "react";
import { get } from "lodash";
import Box from "grommet/components/Box";
import GrommetHeader from "grommet/components/Header";
import Status from "grommet/components/icons/Status";
import { connect } from "react-redux";
import webSocketsSelectors from "../store/webSockets/selectors";
import authSelectors from "../store/authentication/selectors";

function Header({ children, connectionState, currentUser }) {
  let statusValue;
  switch (connectionState) {
    case "CLOSED":
      statusValue = "critical";
      break;
    case "OPENED":
      statusValue = "ok";
      break;
    default:
      statusValue = "unknown";
  }

  return (
    <GrommetHeader>
      {children}
      <Box direction="row" justify="end" flex responsive={false}>
        <Status value={statusValue} size="small" />&nbsp;
        <span className="secondary">{get(currentUser, "name")}</span>
      </Box>
    </GrommetHeader>
  );
}

const mapStateToProps = state => ({
  currentUser: authSelectors.getCurrentUser(state),
  connectionState: webSocketsSelectors.getConnectionState(state)
});

export default connect(mapStateToProps)(Header);
