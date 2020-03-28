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

// Maps file extention to MIME types
const mimeTypeMap = new Map();
mimeTypeMap.set('.ico', 'image/x-icon');
mimeTypeMap.set('.html', 'text/html');
mimeTypeMap.set('.js', 'text/javascript');
mimeTypeMap.set('.json', 'application/json');
mimeTypeMap.set('.css', 'text/css');
mimeTypeMap.set('.png', 'image/png');
mimeTypeMap.set('.jpg', 'image/jpeg');
mimeTypeMap.set('.wav', 'audio/wav');
mimeTypeMap.set('.mp3', 'audio/mpeg');
mimeTypeMap.set('.svg', 'image/svg+xml');
mimeTypeMap.set('.pdf', 'application/pdf');
mimeTypeMap.set('.doc', 'application/msword');
mimeTypeMap.set('.eot', 'appliaction/vnd.ms-fontobject');
mimeTypeMap.set('.ttf', 'aplication/font-sfnt');

export const mimeType = new Proxy(
  mimeTypeMap,
  { get: (obj, prop) => obj.get(prop) || 'text/plain' }
);
