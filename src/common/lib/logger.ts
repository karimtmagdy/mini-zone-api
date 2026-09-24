class Logger {
  private isDev = process.env.NODE_ENV === "development";
  log(...args: unknown[]) {
    if (this.isDev) {
      console.log("[LOG]", ...args);
    }
  }
  error(...args: unknown[]) {
    if (this.isDev) {
      console.error("[ERR]", ...args);
    }
  }
  warn(...args: unknown[]) {
    if (this.isDev) {
      console.warn("[WARN]", ...args);
    }
  }
  info(...args: unknown[]) {
    if (this.isDev) {
      console.info("[INFO]", ...args);
    }
  }
  debug(...args: unknown[]) {
    if (this.isDev) {
      console.debug("[DEBUG]", ...args);
    }
  }
}

export const logger = new Logger();
