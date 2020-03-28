import util from 'util';
import { randomBytes } from 'crypto';

const inspect = Symbol.for('nodejs.util.inspect.custom');
export const _id = Symbol.for('Logger::_id');

const _handleTemplate = (strings, ...values) => {
  return Array.isArray(strings)
    ? strings.reduce((m, c, i) => m + (values[i - 1] || '') + c)
    : [strings, ...values].join(' ');
};

const levels = new Set([
  'verbose',
  'error',
  'warn',
  'info',
  'debug',
  'off',
]);

export class Logger {
  #logFn;
  [_id] = randomBytes(16).toString('hex');

  constructor(name, { loglevel = '' } = {}) {
    this.name = name;
    // prevent non-applicable applicable levels
    if (levels.has(loglevel)) {
      this.#logFn = util.debuglog(loglevel);
    } else throw new TypeError(`${typeof loglevel} ${loglevel} is not a valid log level.`);
  }

  get infoString() {
    const time = (new Date).toISOString();
    return `${this.name} ${time}`;
  }

  log = (...args) => {
    this.#logFn(`${this.infoString} ${_handleTemplate(...args)}`);
  };

  toString = () => [
    `\nLogger ${this.name} {`,
    `  _id: ${this[_id]}`,
    `  name: ${this.name}`,
    `}\n`,
  ].join('\n');

  [inspect] = () => this.toString();
}
