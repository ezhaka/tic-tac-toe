import { createTestScheduler } from "../../utils/testUtils";
import epic from "./epics";
import {
  initializationFailed,
  initializationSuccessful,
  initialize
} from "./actions";
import { authenticated } from "../authentication/actions";
import {
  openWebSocketConnection,
  webSocketConnectionOpened
} from "../webSockets/actions";
import {
  activeBoardListLoaded,
  enterBoard,
  finishedBoardLoaded,
  playerWonMessage
} from "../boards/actions";
import { rootReducer } from "../configureStore";
import { coordinates } from "../boards/test/testData";

it("successful initialization", () => {
  createTestScheduler().run(({ hot, cold, expectObservable }) => {
    const action$ = hot("-a----b", {
      a: initialize(),
      b: webSocketConnectionOpened()
    });

    const state$ = cold("|");

    const user = { id: 1, name: "lovely taylor" };

    const dependencies = {
      ajax: {
        post: (url = "/api/auth") =>
          cold("---a|", {
            a: { response: user }
          }),
        get: (url = "/api/boards") =>
          cold("---a|", {
            a: { response: [] }
          })
      }
    };

    const output$ = epic(action$, state$, dependencies);

    expectObservable(output$).toBe("----ab---cd", {
      a: authenticated(user),
      b: openWebSocketConnection(),
      c: activeBoardListLoaded([]),
      d: initializationSuccessful()
    });
  });
});

it("failed authentication", () => {
  createTestScheduler().run(({ hot, cold, expectObservable }) => {
    const action$ = hot("-a", {
      a: initialize()
    });

    const state$ = cold("|");

    const dependencies = {
      ajax: {
        post: (url = "/api/auth") => cold("---#")
      }
    };

    const output$ = epic(action$, state$, dependencies);

    expectObservable(output$).toBe("----a", {
      a: initializationFailed()
    });
  });
});

it("failed boards fetch", () => {
  createTestScheduler().run(({ hot, cold, expectObservable }) => {
    const action$ = hot("-a", {
      a: webSocketConnectionOpened()
    });

    const state$ = cold("|");

    const dependencies = {
      ajax: {
        get: (url = "/api/boards") => cold("---#")
      }
    };

    const output$ = epic(action$, state$, dependencies);

    expectObservable(output$).toBe("----a", {
      a: initializationFailed()
    });
  });
});

it("dirty board reload", () => {
  createTestScheduler().run(({ hot, cold, expectObservable }) => {
    const action$ = hot("--a", {
      a: activeBoardListLoaded([])
    });

    const state = [
      activeBoardListLoaded([{ id: 1, moves: [] }]),
      enterBoard(1),
      activeBoardListLoaded([])
    ].reduce(rootReducer, undefined);

    const state$ = hot("-a", { a: state });
    state$.value = state;

    const finishedBoard = {
      id: 1,
      winner: { userId: 2 }
    };

    const dependencies = {
      ajax: {
        get: (url = "/api/boards/{boardId}") =>
          cold("---a|", {
            a: { response: finishedBoard }
          })
      }
    };

    const output$ = epic(action$, state$, dependencies);

    expectObservable(output$).toBe("-----a", {
      a: finishedBoardLoaded(finishedBoard)
    });
  });
});

it("should not reload finished board", () => {
  createTestScheduler().run(({ hot, cold, expectObservable }) => {
    const action$ = hot("--a", {
      a: activeBoardListLoaded([])
    });

    const state = [
      activeBoardListLoaded([{ id: 1, moves: [] }]),
      enterBoard(1),
      playerWonMessage(1, { coordinates: coordinates(0, 0) }, { userId: 1 }),
      activeBoardListLoaded([])
    ].reduce(rootReducer, undefined);

    const state$ = hot("-a", { a: state });
    state$.value = state;

    const dependencies = {
      ajax: {}
    };

    const output$ = epic(action$, state$, dependencies);

    expectObservable(output$).toBe("------");
  });
});
