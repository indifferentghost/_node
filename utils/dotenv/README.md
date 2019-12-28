# utils/dotenv

## `dotenv.config(/* customPath */);`

Imports environment variables formatted like `KEY=VALUE` into the
`process.env`.

### Parameters
- *customPath* [optional]: defaults to the root `__dirname/.env`

### Example

```sh
# ./env
NODE_ENV=development
```

```js
import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.NODE_ENV) // development;
```
