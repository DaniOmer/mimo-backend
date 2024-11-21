import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { LoggerConfig } from "../../config/logger/logger.config";
import { CustomError } from "../../config/error/error.config";

const logger = LoggerConfig.get().logger;

export const errorHandler = (
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
    res.status(statusCode).send({ errors });
  } else {
    logger.error(`Error: ${JSON.stringify(err)}`);
    res.status(500).send({ errors: [{ message: "Something went wrong" }] });
  }
};
