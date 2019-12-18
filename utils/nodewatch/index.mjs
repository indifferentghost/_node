import fs from 'fs';

const [, directory, ...args] = process.argv.slice(0);

fs.watch(directory, {
  recursive: true,
  persistent: true,
});

