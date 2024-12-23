import { BaseService } from "../../../../librairies/services/base.service";
import { SizeRepository } from "../../data-access/size/size.repository";
import { ISize } from "../../data-access/size/size.interface";

export class SizeService extends BaseService {
  private repository: SizeRepository;

  constructor() {
    super("Size");
    this.repository = new SizeRepository();
  }

  async createSize(data: Partial<ISize>): Promise<ISize> {
    return this.repository.create(data);
  }

  async getSizeById(id: string): Promise<ISize> {
    const size = await this.repository.getById(id);
    return this.validateDataExists(size, id);
  }

  async getAllSizes(): Promise<ISize[]> {
    return this.repository.getAll();
  }

  async updateSizeById(id: string, updates: Partial<ISize>): Promise<ISize> {
    const updatedSize = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedSize, id);
  }

  async deleteSizeById(id: string): Promise<ISize> {
    const deletedSize = await this.repository.deleteById(id);
    return this.validateDataExists(deletedSize, id);
  }
}
