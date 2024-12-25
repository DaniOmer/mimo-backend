import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../controllers/api.response";

export const validateDtoMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      ApiResponse.error(
        res,
        "Validation failed",
        400,
        errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }))
      );
      return;
    }
    // req.body = dtoInstance;
    next();
  };
};
