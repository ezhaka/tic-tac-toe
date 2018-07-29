import { mapStateToProps } from "./Board";
import configureStore from "../store/configureStore";
import {
  boardCreated,
  boardListLoaded,
  moveMade as moveMadeAction,
  playerWonMessage
} from "../store/boards/actions";
import { curry } from "lodash";

const boardId = 1;

const twoPlayerBoard = {
  id: boardId,
  moves: [],
  players: [
    {
      user: {
        id: 1,
        name: "user one"
      },
      iconType: "UNICORN"
    },
    {
      user: {
        id: 2,
        name: "user two"
      },
      iconType: "HEDGEHOG"
    }
  ]
};

const moveMade = curry(moveMadeAction)(boardId);

const coordinateRange = ([fromRow, fromColumn], [toRow, toColumn]) => ({
  from: {
    row: fromRow,
    column: fromColumn
  },
  to: {
    row: toRow,
    column: toColumn
  }
});

it("unfinished board", () => {
  // arrange
  const store = configureStore();
  store.dispatch(boardListLoaded([]));
  store.dispatch(boardCreated(twoPlayerBoard));
  store.dispatch(moveMade(1, 0, 0));
  store.dispatch(moveMade(2, 0, 1));
  store.dispatch(moveMade(1, 1, 0));
  store.dispatch(moveMade(2, 2, 2));

  // act
  let props = mapStateToProps(store.getState(), { boardId });

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
  const store = configureStore();
  store.dispatch(boardListLoaded([]));
  store.dispatch(boardCreated(twoPlayerBoard));
  store.dispatch(moveMade(1, 0, 0));
  store.dispatch(moveMade(2, 7, 0));
  store.dispatch(moveMade(1, 1, 1));
  store.dispatch(moveMade(2, 7, 1));
  store.dispatch(moveMade(1, 2, 2));
  store.dispatch(moveMade(2, 7, 2));
  store.dispatch(moveMade(1, 4, 2));
  store.dispatch(moveMade(2, 8, 0));
  store.dispatch(moveMade(1, 5, 1));
  store.dispatch(moveMade(2, 8, 1));
  store.dispatch(moveMade(1, 6, 0));
  store.dispatch(moveMade(2, 8, 2));
  store.dispatch(moveMade(1, 2, 4));
  store.dispatch(moveMade(2, 9, 0));
  store.dispatch(moveMade(1, 1, 5));
  store.dispatch(moveMade(2, 9, 1));
  store.dispatch(moveMade(1, 0, 6));
  store.dispatch(moveMade(2, 9, 2));
  store.dispatch(moveMade(1, 4, 4));
  store.dispatch(moveMade(2, 7, 4));
  store.dispatch(moveMade(1, 5, 5));
  store.dispatch(moveMade(2, 8, 4));
  store.dispatch(moveMade(1, 6, 6));
  store.dispatch(moveMade(2, 9, 4));

  store.dispatch(
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
  );

  // act
  let props = mapStateToProps(store.getState(), { boardId });

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
  const store = configureStore();
  store.dispatch(boardListLoaded([]));
  store.dispatch(boardCreated(twoPlayerBoard));
  store.dispatch(moveMade(1, 0, 3));
  store.dispatch(moveMade(2, 7, 0));
  store.dispatch(moveMade(1, 1, 3));
  store.dispatch(moveMade(2, 7, 1));
  store.dispatch(moveMade(1, 2, 3));
  store.dispatch(moveMade(2, 7, 2));
  store.dispatch(moveMade(1, 4, 3));
  store.dispatch(moveMade(2, 8, 0));
  store.dispatch(moveMade(1, 5, 3));
  store.dispatch(moveMade(2, 8, 1));
  store.dispatch(moveMade(1, 6, 3));
  store.dispatch(moveMade(2, 8, 2));
  store.dispatch(moveMade(1, 3, 0));
  store.dispatch(moveMade(2, 9, 0));
  store.dispatch(moveMade(1, 3, 1));
  store.dispatch(moveMade(2, 9, 1));
  store.dispatch(moveMade(1, 3, 2));
  store.dispatch(moveMade(2, 9, 2));
  store.dispatch(moveMade(1, 3, 4));
  store.dispatch(moveMade(2, 7, 4));
  store.dispatch(moveMade(1, 3, 5));
  store.dispatch(moveMade(2, 8, 4));
  store.dispatch(moveMade(1, 3, 6));
  store.dispatch(moveMade(2, 9, 4));

  store.dispatch(
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
  );

  // act
  let props = mapStateToProps(store.getState(), { boardId });

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
