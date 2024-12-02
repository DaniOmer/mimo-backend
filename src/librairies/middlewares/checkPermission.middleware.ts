import { Request, Response, NextFunction } from "express";
import BadRequestError from "../../config/error/bad.request.config";
import { UserPermission } from "../../apps/auth/domain";

export const checkPermissionMiddleware =
  (perm: string) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new BadRequestError({
          message: "Unauthorized access: User not authenticated",
          code: 401,
          logging: true,
        });
      }

      if (
        !user.permissions.some(
          (permission: UserPermission) => permission.name === perm
        )
      ) {
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
