import React from "react";
import Emoji from "./Emoji/Emoji";

export default function Player({ player }) {
  // TODO: do not hardcode icon size
  return (
    <span>
      <Emoji type={player.iconType} size="22px" /> {player.user.name}
    </span>
  );
}
