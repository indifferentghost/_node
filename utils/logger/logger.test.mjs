import { Logger } from './logger.mjs';

const myLog = new Logger('test-logger', { logLevel: '' });

myLog.log`test`;
myLog.log`whatever`;
console.log(myLog);
