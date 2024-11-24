import BadRequestError from "../../config/error/bad.request.config";

export class BaseService<T> {
  private repository: {
    create: (data: Partial<T>) => Promise<T>;
    getById: (id: string) => Promise<T | null>;
    getAll: () => Promise<T[]>;
    updateById: (id: string, updates: Partial<T>) => Promise<T | null>;
    deleteById: (id: string) => Promise<T | null>;
  };

  private entityName: string; 

  constructor(repository: typeof this.repository, entityName: string) {
    this.repository = repository;
    this.entityName = entityName; 
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async getById(id: string): Promise<T> {
    const entity = await this.repository.getById(id);
    return this.validateEntityExists(entity, id, "getById");
  }

  async getAll(): Promise<T[]> {
    return this.repository.getAll();
  }

  async updateById(id: string, updates: Partial<T>): Promise<T> {
    const entity = await this.repository.updateById(id, updates);
    return this.validateEntityExists(entity, id, "updateById");
  }

  async deleteById(id: string): Promise<T> {
    const entity = await this.repository.deleteById(id);
    return this.validateEntityExists(entity, id, "deleteById");
  }

  /**
   * Vérifie si une entité existe, sinon lève une BadRequestError.
   * @param entity - L'entité récupérée
   * @param id - L'ID de l'entité
   * @param operation - L'opération en cours (ex: "getById", "updateById", etc.)
   */
  private validateEntityExists(entity: T | null, id: string, operation: string): T {
    if (!entity) {
      throw new BadRequestError({
        message: `${this.entityName} not found for ID: ${id}`,
        code: 404,
        context: {
          id,
          entity: this.entityName,
          operation,
          timestamp: new Date().toISOString(),
        },
      });
    }
    return entity;
  }
}
