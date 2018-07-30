export const SET_UNABLE_TO_CREATE_BOARD = "CHANGE_BOARD_PAGE_STATUS";

export const setUnableToCreateBoard = isError => ({
  type: SET_UNABLE_TO_CREATE_BOARD,
  isError
});
