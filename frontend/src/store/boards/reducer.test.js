import {
  BOARD_LIST_LOADED,
  boardListLoaded,
  enterBoard,
  leaveBoard,
  MOVE_MADE,
  PLAYER_JOINED,
  PLAYER_WON,
  playerJoined,
  moveMade as moveMadeAction
} from "./actions";
import reducer from "./reducer";
import {
  coordinateRange,
  coordinates,
  player,
  twoPlayerBoard
} from "./test/testData";
import selectors from "./selectors";
import { iconTypes } from "../../components/Emoji/Emoji";
import { curry } from "lodash";

const globalize = state => ({ boards: state });

const boardId = 1;
const moveMade = curry(moveMadeAction)(boardId);

it(`${BOARD_LIST_LOADED} action`, () => {
  const nextState = reducer(
    undefined,
    boardListLoaded([twoPlayerBoard(boardId)])
  );

  expect(selectors.getBoardById(globalize(nextState), boardId)).toEqual(
    twoPlayerBoard(boardId)
  );
});

it(`${PLAYER_JOINED} action`, () => {
  let nextState = reducer(
    undefined,
    boardListLoaded([twoPlayerBoard(boardId)])
  );
  nextState = reducer(
    nextState,
    playerJoined(boardId, player(3, iconTypes.CACTUS))
  );

  let board = selectors.getBoardById(globalize(nextState), boardId);
  expect(board.players).toEqual([
    player(1, iconTypes.UNICORN),
    player(2, iconTypes.HEDGEHOG),
    player(3, iconTypes.CACTUS)
  ]);
});

it(`${MOVE_MADE} action`, () => {
  let nextState = reducer(
    undefined,
    boardListLoaded([twoPlayerBoard(boardId)])
  );

  const action = {
    type: MOVE_MADE,
    boardId,
    move: { userId: 1, coordinates: coordinates(0, 0) }
  };

  nextState = reducer(nextState, action);

  let board = selectors.getBoardById(globalize(nextState), boardId);
  expect(board.moves).toEqual([action.move]);
});

const playerWonAction = {
  type: PLAYER_WON,
  boardId,
  move: { userId: 1, coordinates: coordinates(0, 0) },
  winner: {
    userId: 1,
    ranges: [coordinateRange([0, 0], [0, 0])]
  }
};

it("should remove finished board from store", () => {
  let nextState = reducer(
    undefined,
    boardListLoaded([twoPlayerBoard(boardId)])
  );

  nextState = reducer(nextState, playerWonAction);

  let board = selectors.getBoardById(globalize(nextState), boardId);
  expect(board).toBeFalsy();
});

it("should not remove finished board if it's current one", () => {
  let nextState = reducer(
    undefined,
    boardListLoaded([twoPlayerBoard(boardId)])
  );

  nextState = reducer(nextState, enterBoard(boardId));
  nextState = reducer(nextState, playerWonAction);

  let board = selectors.getBoardById(globalize(nextState), boardId);
  expect(board).toBeTruthy();
});

it("should remove finished board on exit", () => {
  let nextState = reducer(
    undefined,
    boardListLoaded([twoPlayerBoard(boardId)])
  );

  nextState = reducer(nextState, enterBoard(boardId));
  nextState = reducer(nextState, playerWonAction);
  nextState = reducer(nextState, leaveBoard());

  let board = selectors.getBoardById(globalize(nextState), boardId);
  expect(board).toBeFalsy();
});

it("should apply pending messages when board list loaded", () => {
  let version = 0;

  const actions = [
    enterBoard(boardId),
    moveMade(/* userId: */ 1, /* coordinates: */ 1, 1, ++version),
    playerJoined(boardId, player(2, iconTypes.HEDGEHOG), ++version),
    moveMade(/* userId: */ 2, /* coordinates: */ 0, 1, ++version),
    playerJoined(boardId, player(3, iconTypes.TURTLE), ++version),
    { ...playerWonAction, version: ++version },

    boardListLoaded([
      {
        id: boardId,
        version: 2,
        moves: [{ userId: 1, coordinates: coordinates(1, 1) }],
        players: [player(1, iconTypes.UNICORN), player(2, iconTypes.HEDGEHOG)]
      }
    ])
  ];

  const state = actions.reduce(reducer, undefined);

  const board = selectors.getBoardById(globalize(state), boardId);
  expect(board).toEqual({
    id: 1,
    version: 2,
    moves: [
      { coordinates: { column: 1, row: 1 }, userId: 1 },
      { coordinates: { column: 1, row: 0 }, userId: 2 },
      { coordinates: { column: 0, row: 0 }, userId: 1 }
    ],
    players: [
      { iconType: "UNICORN", user: { id: 1, name: "user 1" } },
      { iconType: "HEDGEHOG", user: { id: 2, name: "user 2" } },
      { iconType: "TURTLE", user: { id: 3, name: "user 3" } }
    ],
    winner: {
      ranges: [{ from: { column: 0, row: 0 }, to: { column: 0, row: 0 } }],
      userId: 1
    }
  });
});
