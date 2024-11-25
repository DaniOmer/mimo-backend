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
   * @param entityNameOverride - Nom de l'entité, si différent de la valeur par défaut
   */
  protected validateDataExists<E>(
    entity: E | null,
    id: string,
    entityNameOverride?: string
  ): E {
    if (!entity) {
      throw new BadRequestError({
        message: `${
          entityNameOverride || this.entityName
        } not found for ID: ${id}`,
        code: 404,
      });
    }
    return entity;
  }
}