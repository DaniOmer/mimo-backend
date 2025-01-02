import { BaseService } from "../../../../librairies/services/base.service";
import { ProductFeatureRepository } from "../../data-access/productFeature/productFeature.repository";
import { IProductFeature } from "../../data-access/productFeature/productFeature.interface";

export class ProductFeatureService extends BaseService {
  private repository: ProductFeatureRepository;

  constructor() {
    super("ProductFeature");
    this.repository = new ProductFeatureRepository();
  }

  async createFeature(data: Partial<IProductFeature>): Promise<IProductFeature> {
    return this.repository.create(data);
  }

  async getFeatureById(id: string): Promise<IProductFeature> {
    const feature = await this.repository.getById(id);
    return this.validateDataExists(feature, id);
  }

  async getAllFeatures(): Promise<IProductFeature[]> {
    return this.repository.getAll();
  }

  async updateFeatureById(
    id: string,
    updates: Partial<IProductFeature>
  ): Promise<IProductFeature> {
    const updatedFeature = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedFeature, id);
  }

  async deleteFeatureById(id: string): Promise<IProductFeature> {
    const deletedFeature = await this.repository.deleteById(id);
    return this.validateDataExists(deletedFeature, id);
  }

  async findFeaturesByIds(featureIds: string[]): Promise<IProductFeature[]> {
    return this.repository.findByIds(featureIds);
  }
}
