import { mapStateToProps } from "./Board";
import configureStore from "../store/configureStore";
import {
  boardCreated,
  boardListLoaded,
  moveMade as moveMadeAction
} from "../store/boards/actions";

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

const moveMade = (userId, row, column) =>
  moveMadeAction(boardId, {
    userId,
    coordinates: {
      row,
      column
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
    winnerCells: null
  });
});

it("diagonal winner", () => {
  // TODO
});
