/**
 * http://randycoulman.com/blog/2016/09/27/modular-reducers-and-selectors/#comment-3017253540
 */
export const fromRoot = key => selector => (state, ...args) =>
  selector(state[key], ...args);
