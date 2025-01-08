import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import BadRequestError from "../../config/error/bad.request.config";

export const validateIdMiddleware =
  (entityName: string, paramName: string = "id") =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params[paramName];

      if (!isValidObjectId(id)) {
        throw new BadRequestError({
          message: `Invalid identifier for ${entityName}`,
          code: 400,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
