export interface IRepository<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  create(item: Partial<T>): Promise<T>;
  updateById(id: string, update: T): Promise<T | null>;
  deleteById(id: string): Promise<T | null>;
}
