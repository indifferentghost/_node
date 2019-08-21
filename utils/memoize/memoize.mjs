/**
 * Caches a function
 *
 * @param {function} callback - function to be cached
 */
const memoize = callback => {
  const memo = new Proxy({}, {
    set: (memo, args, value) => {
      memo[JSON.stringify(args)] = value;
    },
    get: (memo, args) => memo[JSON.stringify(args)],
    has: (memo, args) => memo[JSON.stringify(args)] !== undefined
  });

  return (...args) => {
    if (!args in memo) {
      memo[args] = callback(args);
    }
    return memo[args];
  };
};

export default memoize;

