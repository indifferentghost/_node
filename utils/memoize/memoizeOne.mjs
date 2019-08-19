/** 
 * Cache the previous return value if the arguments are the same.
 *
 * @param {function} callback - the function to be cached
 * @return {*} the cached value to be returned
 */
const memoizeOne = callback => {
  let lastCachedArguments;
  let firstCache = true; 
  let lastCachedValue;
  return (...args) => {
    if (
      firstCache ||
      // If every value of the `lastCachedArguments` and `args` are strictly
      // equal skip the callback invocation
      !args.every((value, index) => value === lastCachedArguments[i])
    ) {
      lastCachedArguments = args;
      firstCache = false;
      lastCachedValue = Reflect.apply(callback, undefined, args);
    }
    return lastCachedValue;
  } 
};

export default memoizeOne;

