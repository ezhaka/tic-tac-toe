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

export const iconTypes = {
  UNICORN: "UNICORN",
  HEDGEHOG: "HEDGEHOG",
  TURTLE: "TURTLE",
  DUCK: "DUCK",
  CACTUS: "CACTUS",
  BUTTERFLY: "BUTTERFLY",
  SQUID: "SQUID",
  WHALE: "WHALE",
  SNAIL: "SNAIL",
  HATCHING_CHICK: "HATCHING_CHICK"
};

function getIcon(type) {
  switch (type) {
    case iconTypes.UNICORN:
      return unicorn;
    case iconTypes.HEDGEHOG:
      return hedgehog;
    case iconTypes.TURTLE:
      return turtle;
    case iconTypes.DUCK:
      return duck;
    case iconTypes.CACTUS:
      return cactus;
    case iconTypes.BUTTERFLY:
      return butterfly;
    case iconTypes.SQUID:
      return squid;
    case iconTypes.WHALE:
      return whale;
    case iconTypes.SNAIL:
      return snail;
    case iconTypes.HATCHING_CHICK:
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
