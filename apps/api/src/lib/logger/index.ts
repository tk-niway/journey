type LogMethod = (...args: unknown[]) => void;

type Logger = {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  debug: LogMethod;
  trace: LogMethod;
  fatal: LogMethod;
  log: LogMethod;
  dir: LogMethod;
  time: (label?: string) => void;
  timeEnd: (label?: string) => void;
  timeLog: (label?: string) => void;
};

const createLogger = (base: Console = console): Logger => ({
  info: (...args) => base.info(...args),
  error: (...args) => base.error(...args),
  warn: (...args) => base.warn(...args),
  debug: (...args) => base.debug(...args),
  trace: (...args) => base.trace(...args),
  fatal: (...args) => base.error(...args),
  log: (...args) => base.log(...args),
  dir: (...args) => base.dir(...args),
  time: (label) => base.time(label),
  timeEnd: (label) => base.timeEnd(label),
  timeLog: (label) => base.timeLog(label),
});

export default createLogger();
