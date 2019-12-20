import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getRootDirectoryBasedOnFile } from 'dirname';
import { normalizePath } from './helpers.mjs'

const __dirname = globalThis.__dirname = getRootDirectoryBasedOnFile();
dotenv.config();

const port = process.env.PORT || 8000;

// Maps file extention to MIME types
const mimeType = new Proxy(
  {
    '.ico'  : 'image/x-icon',
    '.html' : 'text/html',
    '.js'   : 'text/javascript',
    '.json' : 'application/json',
    '.css'  : 'text/css',
    '.png'  : 'image/png',
    '.jpg'  : 'image/jpeg',
    '.wav'  : 'audio/wav',
    '.mp3'  : 'audio/mpeg',
    '.svg'  : 'image/svg+xml',
    '.pdf'  : 'application/pdf',
    '.doc'  : 'application/msword',
    '.eot'  : 'appliaction/vnd.ms-fontobject',
    '.ttf'  : 'aplication/font-sfnt',
  },
  {
    get: (obj, prop) => obj[prop] || 'text/plain',
  }
);

/**
 * Static file server
 */
const server = http.createServer((request, response) => {
  console.info(`${request.method} ${request.url}`);
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
  console.info(
    `\nServer listening on port: ${port}.`,
    `\nOn process id ${process.pid}.`,
  );
});
