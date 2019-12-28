import * as dotenv from '../index.mjs';
import fs from 'fs';

const envTestData = new Uint8Array(Buffer.from(
  'HELLO=World\n' +
  'HOW=areYou'
));

fs.writeFileSync('./test/.env.test', envTestData);

dotenv.config('./test/.env.test');

const { HELLO, HOW } = process.env;
console.assert(HELLO === 'World', '$HELLO doesn\'t equal World,' + HELLO);
console.assert(HOW === 'areYou', 'HOW doesn\'t equal areYou' + HOW);
