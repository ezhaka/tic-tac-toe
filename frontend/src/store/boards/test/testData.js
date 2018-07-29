import { iconTypes } from "../../../components/Emoji/Emoji";

export const player = (userId, iconType) => ({
  user: { id: userId, name: `user ${userId}` },
  iconType
});

export const onePlayerBoard = boardId => ({
  id: boardId,
  version: 0,
  moves: [],
  players: [player(1, iconTypes.UNICORN)]
});

export const twoPlayerBoard = boardId => ({
  ...onePlayerBoard(boardId),
  players: [player(1, iconTypes.UNICORN), player(2, iconTypes.HEDGEHOG)]
});

export const coordinates = (fromRow, fromColumn) => ({
  row: fromRow,
  column: fromColumn
});

export const coordinateRange = ([fromRow, fromColumn], [toRow, toColumn]) => ({
  from: coordinates(fromRow, fromColumn),
  to: coordinates(toRow, toColumn)
});
