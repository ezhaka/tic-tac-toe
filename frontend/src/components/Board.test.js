import { mapStateToProps } from "./Board";
import { rootReducer } from "../store/configureStore";
import {
  boardCreated,
  activeBoardListLoaded,
  enterBoard,
  moveMade as moveMadeAction,
  playerWonMessage
} from "../store/boards/actions";
import { partial } from "lodash";
import { coordinateRange, twoPlayerBoard } from "../store/boards/test/testData";

const boardId = 1;

const moveMade = partial(moveMadeAction, boardId);

it("unfinished board", () => {
  // arrange
  const state = [
    activeBoardListLoaded([]),
    boardCreated(twoPlayerBoard(boardId)),
    moveMade(1, 0, 0),
    moveMade(2, 0, 1),
    moveMade(1, 1, 0),
    moveMade(2, 2, 2)
  ].reduce(rootReducer, undefined);

  // act
  let props = mapStateToProps(state, { boardId });

  // assert
  expect(props).toEqual({
    occupiedCells: {
      "0": { "0": { iconType: "UNICORN" }, "1": { iconType: "HEDGEHOG" } },
      "1": { "0": { iconType: "UNICORN" } },
      "2": { "2": { iconType: "HEDGEHOG" } }
    },
    winnerCells: undefined
  });
});

it("X winner", () => {
  // arrange
  const state = [
    activeBoardListLoaded([]),
    boardCreated(twoPlayerBoard(boardId)),
    enterBoard(boardId),
    // ...several MOVE_MADE actions
    playerWonMessage(
      boardId,
      {
        userId: 1,
        coordinates: {
          row: 3,
          column: 3
        }
      },
      {
        userId: 1,
        ranges: [
          coordinateRange([6, 0], [0, 6]),
          coordinateRange([0, 0], [6, 6])
        ]
      }
    )
  ].reduce(rootReducer, undefined);

  // act
  let props = mapStateToProps(state, { boardId });

  // assert
  expect(props.winnerCells).toEqual({
    "0": { "0": true, "6": true },
    "1": { "1": true, "5": true },
    "2": { "2": true, "4": true },
    "3": { "3": true },
    "4": { "2": true, "4": true },
    "5": { "1": true, "5": true },
    "6": { "0": true, "6": true }
  });
});

it("+ winner", () => {
  // arrange
  const state = [
    activeBoardListLoaded([]),
    boardCreated(twoPlayerBoard(boardId)),
    enterBoard(boardId),
    // ...several MOVE_MADE actions
    playerWonMessage(
      boardId,
      {
        userId: 1,
        coordinates: {
          row: 3,
          column: 3
        }
      },
      {
        userId: 1,
        ranges: [
          coordinateRange([3, 0], [3, 6]),
          coordinateRange([0, 3], [6, 3])
        ]
      }
    )
  ].reduce(rootReducer, undefined);

  // act
  let props = mapStateToProps(state, { boardId });

  // assert
  expect(props.winnerCells).toEqual({
    "0": { "3": true },
    "1": { "3": true },
    "2": { "3": true },
    "3": {
      "0": true,
      "1": true,
      "2": true,
      "3": true,
      "4": true,
      "5": true,
      "6": true
    },
    "4": { "3": true },
    "5": { "3": true },
    "6": { "3": true }
  });
});
