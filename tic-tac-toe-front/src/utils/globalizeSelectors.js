const fromRoot = (key) => (selector) => (state, ...args) => selector(state[key], ...args);

/**
 * http://randycoulman.com/blog/2016/09/27/modular-reducers-and-selectors/#comment-3017253540
 */
export default function(selectors, path) {
  return Object.keys(selectors).reduce((final, key) => {
    final[key] = fromRoot(path)(selectors[key]);
    return final;
  }, {});
}