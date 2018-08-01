export const CREATE_BOARD = "CREATE_BOARD";

export const BOARD_CREATION_FAILED = "BOARD_CREATION_FAILED";
export const BOARD_CREATION_IN_PROGRESS = "BOARD_CREATION_IN_PROGRESS";
export const BOARD_CREATION_SUCCESSFUL = "BOARD_CREATION_SUCCESSFUL";
export const RESET_BOARD_CREATION_ERROR = "RESET_BOARD_CREATION_ERROR";

export const createBoard = () => ({ type: CREATE_BOARD });

export const boardCreationFailed = () => ({ type: BOARD_CREATION_FAILED });

export const boardCreationInProgress = () => ({
  type: BOARD_CREATION_IN_PROGRESS
});

export const boardCreationSuccessful = () => ({
  type: BOARD_CREATION_SUCCESSFUL
});

export const resetBoardCreationError = () => ({
  type: RESET_BOARD_CREATION_ERROR
});
