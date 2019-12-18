import fs from 'fs';
import path from 'path';
import readline from 'readline';

async function dotenv(__dirname) {
  const envPath = path.resolve(__dirname, '.env');
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

export default dotenv;

