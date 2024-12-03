import { Request, Response, NextFunction } from "express";
import { SecurityUtils } from "../../utils/security.utils";
import BadRequestError from "../../config/error/bad.request.config";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new BadRequestError({
        message: "Unauthorized access: No authorization header provided",
        code: 401,
        logging: true,
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new BadRequestError({
        message: "Unauthorized access: Token missing",
        code: 401,
        logging: true,
      });
    }
    const decodedToken = await SecurityUtils.verifyJWTToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};
