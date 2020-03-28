import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import * as dotenv from '@ghost/dotenv';
import { getRootDirectoryBasedOnFile } from '@ghost/dirname';
import { Logger } from '@ghost/logger';
import { normalizePath, mimeType } from './helpers.mjs';

const __dirname = globalThis.__dirname = getRootDirectoryBasedOnFile();
dotenv.config();

const logger = new Logger('test', { loglevel: 'verbose' });

const port = process.env.PORT || 8000;

/**
 * Static file server
 */
const server = http.createServer((request, response) => {
  logger.info(`${request.method} ${request.url}`);
  const [pathname, pathError] = normalizePath(request.url);
  if (pathError) {
    response.statusCode = 404;
    response.end(pathError);
    return;
  }

  fs.readFile(pathname, (error, data) => {
    if (error) {
      response.statusCode = 500;
      response.end(`Error getting ${request.url}`);
      return;
    }

    const ext = path.parse(pathname).ext;
    response.writeHead(200, {
      'Content-type':  mimeType[ext],
      'Content-Length': data.byteLength,
      'Content-Language': 'en',
    });
    response.end(data);
  });
});

server.listen(port, () => {
  logger.log`\n\nServer listening on port: ${port}.\nOn process id ${process.pid}.`;
});
