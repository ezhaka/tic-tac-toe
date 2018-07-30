export const INITIALIZE = "INITIALIZE";
export const INITIALIZATION_FAILED = "INITIALIZATION_FAILED";
export const INITIALIZATION_SUCCESSFUL = "INITIALIZATION_SUCCESSFUL";

export const initialize = () => ({ type: INITIALIZE });
export const initializationFailed = () => ({ type: INITIALIZATION_FAILED });
export const initializationSuccessful = () => ({
  type: INITIALIZATION_SUCCESSFUL
});
