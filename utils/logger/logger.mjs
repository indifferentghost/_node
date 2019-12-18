import util from 'util';
import { randomBytes } from 'crypto';

const inspect = Symbol.for('nodejs.util.inspect.custom');
export const _id = Symbol.for('Logger::_id');

const _handleTemplate = ([strings, ...values]) => {
  return Array.isArray(strings)
    ? strings.reduce((m, c, i) => m + (values[i - 1] || '') + c)
    : [strings, ...values].join(' ');
};

export class Logger {
  #logFn;
  [_id] = randomBytes(16).toString('hex');

  constructor(name, { loglevel = '' } = {}) {
    this.name = name;
    this.#logFn = util.debuglog(loglevel);
  }

  get infoString() {
    const time = (new Date()).toISOString();
    return `${this.name} ${time}`;
  }

  log = (...args) => {
    this.#logFn(`${this.infoString} ${_handleTemplate(...args)}`);
  };

  info = (...args) => {};
  warn = (...args) => {};

  error = (...args) => {};

  [inspect] = () =>
`
Logger ${this.name} {
  _id: ${this[_id]}
  name: ${this.name}
}
`;
}

