import { BaseService } from "../../../../librairies/services";
import { ProductVariantRepository } from "../../data-access";
import { IProductVariant } from "../../data-access";
import BadRequestError from "../../../../config/error/bad.request.config";

export class ProductVariantService extends BaseService {
  readonly repository: ProductVariantRepository;

  constructor() {
    super("ProductVariant");
    this.repository = new ProductVariantRepository();
  }

  async createProductVariant(
    data: Omit<IProductVariant, "_id">
  ): Promise<IProductVariant> {
    const productVariant = await this.repository.create(data);
    if (!productVariant) {
      throw new BadRequestError({
        message: "Failed to create product variant",
        logging: true,
      });
    }
    return productVariant;
  }

  async getProductVariantById(id: string): Promise<IProductVariant | null> {
    const productVariant = await this.repository.getById(id);
    return productVariant;
  }
}
