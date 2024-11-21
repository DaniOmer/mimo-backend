import { Logger, createLogger, transports, format } from "winston";

export class LoggerConfig {
  private static instance?: LoggerConfig;
  readonly logger: Logger;

  private constructor() {
    this.logger = this.initLogger();
  }

  public static get(): LoggerConfig {
    if (!this.instance) {
      this.instance = new LoggerConfig();
    }
    return this.instance;
  }

  private initLogger(): Logger {
    return createLogger({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
      format: format.combine(
        format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: "exceptions.log", level: "error" }),
      ],
    });
  }
}
