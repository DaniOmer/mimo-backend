export class BaseService<T> {
  private repository: {
    create: (data: Partial<T>) => Promise<T>;
    getById: (id: string) => Promise<T | null>;
    getAll: () => Promise<T[]>;
    updateById: (id: string, updates: Partial<T>) => Promise<T | null>;
    deleteById: (id: string) => Promise<T | null>; // Permet à deleteById de retourner l'entité supprimée ou null
  };

  constructor(repository: typeof this.repository) {
    this.repository = repository;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async getById(id: string): Promise<T | null> {
    return this.repository.getById(id);
  }

  async getAll(): Promise<T[]> {
    return this.repository.getAll();
  }

  async updateById(id: string, updates: Partial<T>): Promise<T | null> {
    return this.repository.updateById(id, updates);
  }

  async deleteById(id: string): Promise<T | null> {
    return this.repository.deleteById(id);
  }
}
