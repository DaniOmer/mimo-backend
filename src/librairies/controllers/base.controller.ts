import { Logger } from "winston";
import { LoggerConfig } from "../../config/logger/logger.config";

export default class BaseController {
  readonly logger: Logger;

  constructor() {
    this.logger = LoggerConfig.get().logger;
  }
}
