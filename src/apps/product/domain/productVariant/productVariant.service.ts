import { BaseService } from "../../../../librairies/services";
import { ProductVariantRepository } from "../../data-access";
import { IProductVariant } from "../../data-access";
import BadRequestError from "../../../../config/error/bad.request.config";
import {
  ProductService,
  SizeService,
  ColorService,
} from "../../domain";
import { Types } from "mongoose";

export class ProductVariantService extends BaseService {
  readonly repository: ProductVariantRepository;
  private productService: ProductService;
  private sizeService: SizeService;
  private colorService: ColorService;

  constructor() {
    super("ProductVariant");
    this.repository = new ProductVariantRepository();
    this.productService = new ProductService();
    this.sizeService = new SizeService();
    this.colorService = new ColorService();
  }

  async createProductVariant(
    data: Omit<IProductVariant, "_id">
  ): Promise<IProductVariant> {
    await this.validateDependencies(data);
    const productVariant = await this.repository.create(data);
    if (!productVariant) {
      throw new BadRequestError({
        message: "Failed to create product variant",
        logging: true,
      });
    }
    return productVariant;
  }

  async getProductVariantById(id: string): Promise<IProductVariant> {
    const productVariant = await this.repository.findByIdWithRelations(id);
    if (!productVariant) {
      throw new BadRequestError({
        message: "Product variant not found",
        code: 404,
      });
    }
    return productVariant;
  }

  async getAllVariants(): Promise<IProductVariant[]> {
    return this.repository.getAllWithRelations();
  }

  async updateVariantById(
    id: string,
    updates: Partial<IProductVariant>
  ): Promise<IProductVariant> {
    await this.validateDependencies(updates);
    const updatedVariant = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedVariant, id);
  }

  async deleteVariantById(id: string): Promise<IProductVariant> {
    const deletedVariant = await this.repository.deleteById(id);
    return this.validateDataExists(deletedVariant, id);
  }

  async searchVariants(filters: {
    productId?: string;
    sizeId?: string;
    colorId?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<IProductVariant[]> {
    const query: any = {};

    if (filters.productId) query.productId = filters.productId;
    if (filters.sizeId) query.sizeId = filters.sizeId;
    if (filters.colorId) query.colorId = filters.colorId;

    if (filters.minPrice || filters.maxPrice) {
      query.priceEtx = {};
      if (filters.minPrice) query.priceEtx.$gte = filters.minPrice;
      if (filters.maxPrice) query.priceEtx.$lte = filters.maxPrice;
    }

    return this.repository.findByCriteria(query);
  }


  async getLimitedEditionVariants(): Promise<IProductVariant[]> {
    return this.repository.findLimitedEditionVariants();
  }


  async duplicateVariant(id: string): Promise<IProductVariant> {
    const variant = await this.repository.getById(id);
    this.validateDataExists(variant, id);

    const duplicatedVariantData = {
      ...variant?.toObject(),
      _id: undefined,
      stripeId: undefined, 
    };
    return this.repository.create(duplicatedVariantData);
  }

  private async validateDependencies(data: Partial<IProductVariant>): Promise<void> {
    if (data.productId) {
      const productId = this.toObjectIdString(data.productId);
      await this.productService.getProductById(productId);
    }

    if (data.sizeId) {
      const sizeId = this.toObjectIdString(data.sizeId);
      await this.sizeService.getSizeById(sizeId);
    }

    if (data.colorId) {
      const colorId = this.toObjectIdString(data.colorId);
      await this.colorService.getColorById(colorId);
    }
  }

  /**
   * Convertit un ID en chaîne de caractères.
   * @param id - L'ID à convertir
   */
  private toObjectIdString(id: string | Types.ObjectId): string {
    return typeof id === "string" ? id : id.toString();
  }
}
