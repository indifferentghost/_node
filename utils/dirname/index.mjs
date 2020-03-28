import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { memoizeOne } from '@ghost/memoize';

/** Gets the root directory name */
class WalkingState {
  #dir = '';
  #filename;

  /** @param {string} [filename=package.json] - the filename to base root directory on */
  constructor(filename = 'package.json') {
    this.#filename = filename;
  }

  /**
   * Get the directory in reference to import meta and directory in state
   * @returns {string} a string referencing the directory
   */
  get directory() {
    return path.resolve(import.meta.url, this.#dir);
  }

  /**
   * Get the pathname in reference to import.meta.url and itterative directory
   * @returns {string} a string referencing a possible file in the directory
   */
  get pathname() {
    return path.resolve(this.directory, this.#filename);
  }

  /**
   * Syncroniously walks up the directory tree checking if the pathname exists
   * as a valid file
   * @returns {string} the directory where the final pathname exists
   * @todo: TODO: check if path - '/' and handle error
   */
  findRootDirectory() {
    while (!fs.existsSync(this.pathname)) {
      this.#dir += '../';
    }
    return this.directory;
  }
}

export const getRootDirectoryBasedOnFile = memoizeOne(
  function getRootDirectoryBasedOnFile(filename = 'package.json') {
    return new WalkingState(filename).findRootDirectory();
  }
);

