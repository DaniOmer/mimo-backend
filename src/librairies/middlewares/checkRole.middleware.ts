import { Request, Response, NextFunction } from "express";
import BadRequestError from "../../config/error/bad.request.config";

import { UserRole } from "../../apps/auth/domain";

export const checkRoleMiddleware =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new BadRequestError({
          message: "Unauthorized access: User not authenticated",
          code: 401,
          logging: true,
        });
      }

      const hasRole = user.roles.some((role: UserRole) =>
        roles.includes(role.name)
      );

      if (!hasRole) {
        throw new BadRequestError({
          message: "Unauthorized access: Insufficient permissions",
          code: 403,
          logging: true,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
