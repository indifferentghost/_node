import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getRootDirectoryBasedOnFile } from 'dirname';

const __dirname = globalThis.__dirname = getRootDirectoryBasedOnFile();
dotenv(__dirname);

const port = process.env.PORT || 8000;

// maps file extention to MIME types
const mimeType = {
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
  '.ttf'  : 'aplication/font-sfnt'
};

export default () => {
  const server = http.createServer((req, res) => {
    console.log(`${process.pid} ${req.method} ${req.url}`);

    // parse url
    const parsedUrl = url.parse(req.url);

    // extract URL path
    // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
    // by limiting the path to current directory only
    const sanitizedPath =
      path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname, '/server', sanitizedPath);

    if (!fs.existsSync(pathname)) {
      res.statusCode = 404;
      res.end(`${sanitizedPath} doesn't exist`);
      return;
    }

    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
      pathname = pathname.replace(/\/\//g, '/');
    }

    fs.readFile(pathname, (error, data) => {
      if (error) {
        res.statusCode = 500;
        res.end(`Error getting ${sanitizedPath}`);
        return;
      }

      const ext = path.parse(pathname).ext;
      res.setHeader('Content-type', mimeType[ext] || 'text/plain');
      res.end(data);
    });
  });

  server.listen(port, () => {
    console.info(
      `Server listening on port: ${port}.\n`,
      `On process id ${process.pid}.`
    );
  });
};
