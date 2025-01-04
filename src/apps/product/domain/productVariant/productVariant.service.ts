import { BaseService } from "../../../../librairies/services";
import { ProductVariantRepository } from "../../data-access";
import { IProductVariant } from "../../data-access";
import BadRequestError from "../../../../config/error/bad.request.config";
import {
  ProductService,
  SizeService,
  ColorService,
  ProductVariantUpdateDTO,
} from "../../domain";

import { ProductVariantCreateDTO } from "../../domain";

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
    data: ProductVariantCreateDTO,
    userId: string
  ): Promise<IProductVariant> {
    const validatedData = await this.validateDependencies(data);
    const productVariant = await this.repository.create({
      ...data,
      product: validatedData.product,
      size: validatedData.size,
      color: validatedData.color,
      createdBy: userId,
    });
    if (!productVariant) {
      throw new BadRequestError({
        message: "Failed to create product variant",
        logging: true,
      });
    }
    await this.productService.updateProductById(
      productVariant.product.toString(),
      {
        isActive: true,
      },
      userId
    );
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

  async getVariantsByProductId(productId: string): Promise<IProductVariant[]> {
    const variants = await this.repository.findByCriteria({ productId });
    if (!variants || variants.length === 0) {
      throw new BadRequestError({
        message: "No variants found for the given product ID",
        code: 404,
      });
    }
    return variants;
  }

  async getAllVariants(): Promise<IProductVariant[]> {
    return this.repository.getAllWithRelations();
  }

  async updateVariantById(
    id: string,
    updates: ProductVariantUpdateDTO,
    currentUserId: string
  ): Promise<IProductVariant> {
    await this.validateDependencies(updates);
    const updatedVariant = await this.repository.updateById(id, {
      ...updates,
      updatedBy: currentUserId,
    });
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
    if (!variant) {
      throw new BadRequestError({
        message: "Variant not found.",
        context: { variantId: `No variant found with ID: ${id}` },
        code: 404,
      });
    }

    const {
      productId,
      sizeId,
      colorId,
      priceEtx,
      priceVat,
      material,
      weight,
      isLimitedEdition,
    } = variant.toObject();

    const duplicatedVariantData = {
      productId,
      sizeId,
      colorId,
      priceEtx,
      priceVat,
      material,
      weight,
      isLimitedEdition,
    };
    return this.repository.create(duplicatedVariantData);
  }

  private async validateDependencies(
    data: ProductVariantCreateDTO | ProductVariantUpdateDTO
  ): Promise<{ product: string; size: string; color: string }> {
    if (data.productId) {
      await this.productService.getProductById(data.productId.toString());
    }

    if (data.sizeId) {
      await this.sizeService.getSizeById(data.sizeId.toString());
    }

    if (data.colorId) {
      await this.colorService.getColorById(data.colorId.toString());
    }

    return {
      product: data.productId || "",
      size: data.sizeId || "",
      color: data.colorId || "",
    };
  }
}
