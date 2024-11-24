import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import BadRequestError from "../../config/error/bad.request.config";

/**
 * Middleware pour valider un ID dans la route
 * @param entityName - Nom de l'entité (pour les messages d'erreur)
 * @param paramName - Nom du paramètre dans la route (par défaut : "id")
 */
export const validateIdMiddleware =
  (entityName: string, paramName: string = "id") =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params[paramName];

      if (!isValidObjectId(id)) {
        throw new BadRequestError({
          message: `Invalid ${entityName} ID format`,
          code: 400,
          context: {
            id,
            entity: entityName,
            operation: "validateId",
            timestamp: new Date().toISOString(),
          },
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
