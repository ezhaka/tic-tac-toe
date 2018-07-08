export const fromRoot = (key) => (selector) => (state, ...args) => selector(state[key], ...args);

/**
 * http://randycoulman.com/blog/2016/09/27/modular-reducers-and-selectors/#comment-3017253540
 */
export default function(path, selectors) {
  return Object.keys(selectors).reduce((final, key) => {
    const selector = selectors[key];
    final[key] = fromRoot(path)(selector);
    return final;
  }, {});
}