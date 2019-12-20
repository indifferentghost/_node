import fs from 'fs';
import path from 'path';
import readline from 'readline';

/**
 * @method config
 * @param {string} [relativePath=''] - custom directory path for `.env` file
 * @description Adds anything in .env as properties to the global environment
 */
export const config = async (relativePath = '') => {
  const envPath = path.resolve(__dirname, relativePath, '.env');

  if (fs.existsSync(envPath)) {
    const rl = readline.createInterface({
      input: fs.createReadStream(envPath, { encoding: 'utf8' }),
      console: false,
    });

    for await (const line of rl) {
      const [key, variable] = line.replace(/"/g, '').split('=');
      process.env[key] = variable;
    }
  }
}
