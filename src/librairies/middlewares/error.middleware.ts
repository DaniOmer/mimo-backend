import { Request, Response, NextFunction } from "express";
import { LoggerConfig } from "../../config/logger/logger.config";
import { CustomError } from "../../config/error/error.config";
import { ApiResponse } from "../controllers/api.response";

const logger = LoggerConfig.get().logger;

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const { statusCode, errors, logging, stack } = err;
    if (logging) {
      logger.error(
        JSON.stringify({ status: statusCode, errors: errors, stack: stack })
      );
    }
    ApiResponse.error(res, errors[0].message, statusCode, errors[0].context);
  } else {
    logger.error(`Error: ${JSON.stringify(err)}`);
    ApiResponse.error(res, "Something went wrong", 500);
  }
};
