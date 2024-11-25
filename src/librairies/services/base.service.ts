import BadRequestError from "../../config/error/bad.request.config";

export class BaseService<T> {
  private entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  /**
   * Vérifie si une entité existe, sinon lève une BadRequestError.
   * @param entity - L'entité récupérée
   * @param id - L'ID de l'entité
   */
  protected validateDataExists(entity: T | null, id: string): T {
    if (!entity) {
      throw new BadRequestError({
        message: `${this.entityName} not found for ID: ${id}`,
        code: 404,
      });
    }
    return entity;
  }
}
