import { Logger } from "winston";
import { plainToInstance } from "class-transformer";
import { LoggerConfig } from "../../config/logger/logger.config";

export default class BaseController {
  readonly logger: Logger;

  constructor() {
    this.logger = LoggerConfig.get().logger;
  }

  dataToDtoInstance = <T>(data: any, dtoClass: new () => T): T => {
    return plainToInstance(dtoClass, data);
  };
}
