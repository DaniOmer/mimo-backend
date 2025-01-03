import { BaseService } from "../../../../librairies/services/base.service";
import { ProductHasProductFeatureRepository } from "../../data-access";
import { IProductHasProductFeature } from "../../data-access/productHasProductFeature/productHasProductFeature.interface";
import { Types } from "mongoose";

export class ProductHasProductFeatureService extends BaseService {
    private repository: ProductHasProductFeatureRepository;
  
    constructor() {
      super("ProductHasProductFeature");
      this.repository = new ProductHasProductFeatureRepository();
    }
  
    async addFeatureToProduct(
      productId: string,
      featureId: string,
      value: string
    ): Promise<IProductHasProductFeature> {
      const productIdObject = this.toObjectId(productId);
      const featureIdObject = this.toObjectId(featureId);
  
      return this.repository.create({
        productId: productIdObject,
        featureId: featureIdObject,
        value,
      });
    }
  

    async removeFeatureFromProduct(id: string): Promise<IProductHasProductFeature> {
      const record = await this.repository.deleteById(id);
      return this.validateDataExists(record, id);
    }
  
    /**
     * Convertit une chaîne de caractères en ObjectId
     * @param id - ID en chaîne de caractères
     * @returns ObjectId
     */
    private toObjectId(id: string): Types.ObjectId {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new Types.ObjectId(id);
    }
  }