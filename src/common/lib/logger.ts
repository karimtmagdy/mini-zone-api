import pino from "pino";
import pinoHttp from "pino-http";

// Pino — Application Logger
const isDev = process.env.NODE_ENV === "development";

const pinoInstance = pino({
  // Logging level: debug in development to show everything, info in production to show only important info
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
        // pino-pretty converts JSON to readable colors in the terminal during development
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

// Logger Wrapper

export const logger = {
  /** log → pino.info */
  log: (...args: unknown[]) => {
    if (args.length === 1) {
      // logger.log("message") or logger.log({ key: val })
      typeof args[0] === "string"
        ? pinoInstance.info(args[0])
        : pinoInstance.info(args[0] as object);
    } else {
      // logger.log("message", extraData) → pino.info({ data: extraData }, "message")
      const [first, ...rest] = args;
      typeof first === "string"
        ? pinoInstance.info({ data: rest.length === 1 ? rest[0] : rest }, first)
        : pinoInstance.info(first as object, String(rest[0]));
    }
  },

  /** error → pino.error */
  error: (...args: unknown[]) => {
    if (args.length === 1) {
      typeof args[0] === "string"
        ? pinoInstance.error(args[0])
        : pinoInstance.error(args[0] as object);
    } else {
      const [first, ...rest] = args;
      if (typeof first === "string") {
        const err = rest[0];
        pinoInstance.error(
          {
            err: err instanceof Error ? err : undefined,
            data: err instanceof Error ? undefined : err,
          },
          first,
        );
      } else {
        pinoInstance.error(first as object, String(rest[0]));
      }
    }
  },

  /** warn → pino.warn */
  warn: (...args: unknown[]) => {
    args.length === 1
      ? pinoInstance.warn(String(args[0]))
      : pinoInstance.warn({ data: args.slice(1) }, String(args[0]));
  },

  /** info → pino.info */
  info: (...args: unknown[]) => {
    args.length === 1
      ? pinoInstance.info(String(args[0]))
      : pinoInstance.info({ data: args.slice(1) }, String(args[0]));
  },

  /** debug → pino.debug */
  debug: (...args: unknown[]) => {
    args.length === 1
      ? pinoInstance.debug(String(args[0]))
      : pinoInstance.debug({ data: args.slice(1) }, String(args[0]));
  },

  /** Direct access to the original pino instance if needed */
  pino: pinoInstance,
};

// Pino-Http — HTTP Request Logger Middleware

export const httpLogger = pinoHttp({
  logger: pinoInstance,
  // Health Check Noise
  autoLogging: {
    ignore: (req) => req.url === "/health" || req.url === "/favicon.ico",
  },
  // Custom message for every req
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode} ERROR`;
  },
});
