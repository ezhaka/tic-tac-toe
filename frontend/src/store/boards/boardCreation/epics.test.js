import { push } from "connected-react-router";
import {
  boardCreationFailed,
  boardCreationInProgress,
  boardCreationSuccessful,
  createBoard
} from "./actions";
import epic from "./epics";
import { createTestScheduler } from "../../../utils/testUtils";

it("successful CREATE_BOARD request", () => {
  createTestScheduler().run(({ hot, cold, expectObservable }) => {
    const action$ = hot("-a", { a: createBoard() });
    const state$ = null;

    const dependencies = {
      ajax: {
        post: () =>
          cold("---a", {
            a: { response: { id: 1 } }
          })
      }
    };

    const output$ = epic(action$, state$, dependencies);

    expectObservable(output$).toBe("-a--(bc)", {
      a: boardCreationInProgress(),
      b: push("/boards/1"),
      c: boardCreationSuccessful()
    });
  });
});

it("first failure of CREATE_BOARD should not destroy subscription", () => {
  createTestScheduler().run(({ hot, cold, expectObservable }) => {
    const action$ = hot("-a---a", { a: createBoard() });
    const state$ = null;

    const dependencies = {
      ajax: {
        post: () => cold("-#")
      }
    };

    const output$ = epic(action$, state$, dependencies);

    expectObservable(output$).toBe("-ab--ab", {
      a: boardCreationInProgress(),
      b: boardCreationFailed()
    });
  });
});
