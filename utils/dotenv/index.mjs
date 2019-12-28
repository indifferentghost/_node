import fs from 'fs';
import path from 'path';
import readline from 'readline';

/**
 * @method config
 * @param {string} [relativePath='.env'] - custom directory path for `.env` file
 * @description Adds anything in .env as properties to the global environment
 */
export const config = (relativePath = '.env') => {
  const __dirname = globalThis.__dirname || '';
  const envPath = path.resolve(__dirname, relativePath);

  try {
    // Check for the existence of a file only if the file won’t be used directly
    // Source: https://nodejs.org/api/fs.html#fs_fs_exists_path_callback
    const lines = fs.readFileSync(envPath, { encoding: 'utf8' });

    lines
      .split(/[\r\n]/g)
      .map(line => line.replace(/"/g, '').split('='))
      .forEach(([key, value]) => process.env[key] = value);

  } catch {
    console.error(`${envPath} doesn't exist or is a directory`);
  }
};
