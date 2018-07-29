import React from "react";
import classNames from "classnames";
import "./Emoji.scss";
import unicorn from "./unicorn.png";
import hedgehog from "./hedgehog.png";
import turtle from "./turtle.png";
import duck from "./duck.png";
import cactus from "./cactus.png";
import butterfly from "./butterfly.png";
import squid from "./squid.png";
import whale from "./whale.png";
import snail from "./snail.png";
import hatchingChick from "./hatching-chick.png";

function getIcon(type) {
  switch (type) {
    case "UNICORN":
      return unicorn;
    case "HEDGEHOG":
      return hedgehog;
    case "TURTLE":
      return turtle;
    case "DUCK":
      return duck;
    case "CACTUS":
      return cactus;
    case "BUTTERFLY":
      return butterfly;
    case "SQUID":
      return squid;
    case "WHALE":
      return whale;
    case "SNAIL":
      return snail;
    case "HATCHING_CHICK":
      return hatchingChick;
    default:
      throw new Error(`Unkonwn icon type ${type}`);
  }
}

export default function Emoji({ type, size, inactive }) {
  return (
    <img
      alt=""
      src={getIcon(type)}
      style={{ height: size }}
      className={classNames("emoji-icon", { inactive })}
    />
  );
}
