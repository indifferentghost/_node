import cluster from 'cluster';
import http from 'http';
import server from './server.mjs';

const numCPUs = 4;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  server();
}
