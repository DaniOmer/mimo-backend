import { Logger, createLogger, transports, format } from "winston";
import { AppConfig } from "../../config/app.config";

export class LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = this.initLogger();
  }

  private initLogger(): Logger {
    return createLogger({
      level: AppConfig.logger.level,
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

  getLogger(): Logger {
    return this.logger;
  }
}
