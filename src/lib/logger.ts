import { enviro } from "@/lib/local.env";
class Logger {
  private isDev = enviro;
  log(...args: any[]) {
    if (this.isDev) {
      console.log("[LOG]", ...args);
    }
  }
  error(...args: any[]) {
    if (this.isDev) {
      console.error("[ERR]", ...args);
    }
  }
  warn(...args: any[]) {
    if (this.isDev) {
      console.warn("[WARN]", ...args);
    }
  }
  info(...args: any[]) {
    if (this.isDev) {
      console.info("[INFO]", ...args);
    }
  }
  debug(...args: any[]) {
    if (this.isDev) {
      console.debug("[DEBUG]", ...args);
    }
  }
}

export const logger = new Logger();
