import React from "react";
import Emoji from "./Emoji";

export default function Player({ player }) {
  return (
    <span>
      <Emoji type={player.iconType} /> {player.user.name}
    </span>
  );
}
