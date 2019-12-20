
import url from 'url';
import fs from 'fs';
import path from 'path';

/**
 * Returns a normalized path
 * @typedef {string[]} PathArray
 * @property {string=} [0] - The sanitized and validated path.
 * @property {string=} [1] - An error message.
 */

/**
 * @name normalizePath
 * @param {string} uri - The path to be sanitized and normalized
 * @returns {PathArray}
 */
export const normalizePath = uri => {
  const parsedUrl = url.parse(uri);

  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // by limiting the path to current directory only
  const sanitizedPath =
    path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');

  const pathname = path.join(__dirname, '/static', sanitizedPath);

  if (!fs.existsSync(pathname)) {
    return [, `${sanitizedPath} doesn't exist`];
  }

  return [
    fs.statSync(pathname).isDirectory()
      ? `${pathname}/index.html`.replace(/\/\//g, '/')
      : pathname
  ];
};
