import dayjs from "dayjs";

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

const DateNow = (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');

const createLogger = (base: Console = console): Logger => ({
  info: (...args) => base.info(DateNow(new Date()), ...args),
  error: (...args) => base.error(DateNow(new Date()), ...args),
  warn: (...args) => base.warn(DateNow(new Date()), ...args),
  debug: (...args) => base.debug(DateNow(new Date()), ...args),
  trace: (...args) => base.trace(DateNow(new Date()), ...args),
  fatal: (...args) => base.error(DateNow(new Date()), ...args),
  log: (...args) => base.log(DateNow(new Date()), ...args),
  dir: (...args) => base.dir(DateNow(new Date()), ...args),
  time: (label) => base.time(label),
  timeEnd: (label) => base.timeEnd(label),
  timeLog: (label) => base.timeLog(DateNow(new Date()), label),
});

export default createLogger();
