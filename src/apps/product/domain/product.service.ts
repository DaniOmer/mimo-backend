import { BaseService } from "../../../librairies/services";
import { ProductRepository, IProduct } from "../data-access";
import { CategoryService, ProductFeatureService, ProductImageService, ProductVariantService, InventoryService } from "./";
import { UserService } from "../../auth/domain/user/user.service";
import { Types } from "mongoose";
import BadRequestError from "../../../config/error/bad.request.config";
import { IProductImage } from "../data-access/productImage/productImage.interface";

export class ProductService extends BaseService {
  private repository: ProductRepository;
  private categoryService: CategoryService;
  private featureService: ProductFeatureService;
  private imageService: ProductImageService;
  private userService: UserService;
  private productVariantService: ProductVariantService | null = null;
  private inventoryService: InventoryService | null = null;



  constructor() {
    super("Product");
    this.repository = new ProductRepository();
    this.categoryService = new CategoryService();
    this.featureService = new ProductFeatureService();
    this.imageService = new ProductImageService();
    this.userService = new UserService();

  }

  setProductVariantService(service: ProductVariantService) {
    if (!service) {
      throw new Error("ProductVariantService cannot be null.");
    }
    this.productVariantService = service;
  }

  setInventoryService(service: InventoryService) {
    if (!service) {
      throw new Error("InventoryService cannot be null.");
    }
    this.inventoryService = service;
  }

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    await this.validateDependencies(data);
    return this.repository.create(data);
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.repository.findByIdWithRelations(id);
    return this.validateDataExists(product, id);
  }

  async getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    return this.repository.findByCriteria({ categoryIds: categoryId });
  }

  async getProductsByFeature(featureId: string): Promise<IProduct[]> {
    return this.repository.findByCriteria({ featureIds: featureId });
  }

  async getAllProducts(): Promise<IProduct[]> {
    return this.repository.findAllWithRelations();
  }

  async updateProductById(
    id: string,
    updates: Partial<IProduct>
  ): Promise<IProduct> {
    await this.validateDependencies(updates);
    const updatedProduct = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedProduct, id);
  }

  async deleteProductById(id: string): Promise<IProduct> {
    const deletedProduct = await this.repository.deleteById(id);
    return this.validateDataExists(deletedProduct, id);
  }

  async toggleProductActivation(id: string, isActive: boolean): Promise<IProduct> {
    const product = await this.repository.getById(id);
    if (!product) {
      throw new BadRequestError({
        message: "Product not found.",
        context: { productId: `No product found with ID: ${id}` },
        code: 404,
      });
    }

    const updatedProduct = await this.repository.updateById(id, { isActive });
    return this.validateDataExists(updatedProduct, id);
  }

  async searchProducts(filters: {
    name?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
  }): Promise<IProduct[]> {
    const query: any = {};

    if (filters.name) query.name = { $regex: filters.name, $options: "i" };
    if (filters.categoryIds) query.categoryIds = { $in: filters.categoryIds };
    if (filters.minPrice || filters.maxPrice) {
      query.priceEtx = {};
      if (filters.minPrice) query.priceEtx.$gte = filters.minPrice;
      if (filters.maxPrice) query.priceEtx.$lte = filters.maxPrice;
    }

    return this.repository.findByCriteria(query);
  }

  async duplicateProduct(id: string): Promise<IProduct> {
    const product = await this.repository.getById(id);
    if (!product) {
      throw new BadRequestError({
        message: "Product not found.",
        context: { productId: `No product found with ID: ${id}` },
        code: 404,
      });
    }
    const { name, description, priceEtx, priceVat, isActive, images, categoryIds, featureIds, createdBy } = product.toObject();

    const duplicatedProduct = {
      name: `${name} - Copy`,
      description,
      priceEtx,
      priceVat,
      isActive,
      images,
      categoryIds,
      featureIds,
      createdBy,
    };
    return this.repository.create(duplicatedProduct);
  }

  async getProductsByStatus(isActive: boolean): Promise<IProduct[]> {
    return this.repository.findByStatus(isActive);
  }

  async addImagesToProduct(productId: string, images: Partial<IProductImage>[]): Promise<IProduct> {
    const product = await this.repository.getById(productId);
    if (!product) {
      throw new BadRequestError({
        message: "Product not found.",
        context: { productId: `No product found with ID: ${productId}` },
        code: 404,
      });
    }
  
    const createdImages = await Promise.all(
      images.map((image) => this.imageService.createProductImage({ ...image,  productId: new Types.ObjectId(productId),}))
    );
  
    const imageIds = createdImages.map((image) => image._id);
  
    product.images = product.images
      ? [...product.images, ...imageIds.map((id) => new Types.ObjectId(id))]
      : imageIds.map((id) => new Types.ObjectId(id));
  
    const updatedProduct = await this.repository.updateById(productId, { images: product.images });
    return this.validateDataExists(updatedProduct, productId);
  }

  async removeImageFromProduct(productId: string, imageId: string): Promise<IProduct> {
    const product = await this.repository.getById(productId);
    if (!product) {
      throw new BadRequestError({
        message: "Product not found.",
        context: { productId: `No product found with ID: ${productId}` },
        code: 404,
      });
    }
  
    if (!product.images || !product.images.includes(imageId as any)) {
      throw new BadRequestError({
        message: "Image not associated with this product.",
        context: { productId: productId, image_id: imageId },
        code: 400,
      });
    }
  
    await this.imageService.deleteProductImageById(imageId);
  
    product.images = product.images.filter((id) => id.toString() !== imageId);
    const updatedProduct = await this.repository.updateById(productId, { images: product.images });
  
    return this.validateDataExists(updatedProduct, productId);
  }

  async getProductWithVariants(id: string): Promise<any> {
    if (!this.productVariantService || !this.inventoryService) {
      throw new Error("Dependencies not initialized.");
    }

    const product = await this.repository.findByIdWithRelations(id);
    if (!product) {
        throw new BadRequestError({ message: "Product not found.", code: 404 });
    }

    const variants = await this.productVariantService.getVariantsByProductId(id);
    const inventories = await this.inventoryService.getInventoriesWithProductAndVariant();

    const variantDetails = variants.map((variant) => {
        const inventory = inventories.find(
            (inv) => inv.productVariant?.toString() === variant._id.toString()
        );
        return {
            ...variant.toObject(),
            quantity: inventory ? inventory.quantity - inventory.reservedQuantity : 0,
        };
    });

    return { product, variants: variantDetails };
}

  async getAllProductsWithVariants(): Promise<any[]> {

    if (!this.productVariantService || !this.inventoryService) {
      throw new Error("Dependencies not initialized.");
    }

    const products = await this.repository.findAllWithRelations();
    const variants = await this.productVariantService.getAllVariants();  
    const inventoryData = await this.inventoryService.getInventoriesWithProductAndVariant();
  
    return products.map((product) => {
      const productVariants = variants
        .filter((variant) => variant.productId._id.toString() === product._id.toString())
        .map((variant) => {
          const inventory = inventoryData.find(
            (inv) => inv.productVariant?.toString() === variant._id.toString()
          );
          return {
            ...variant.toObject(),
            quantity: inventory ? inventory.quantity - inventory.reservedQuantity : 0,
          };
        });
  
      return { product, variants: productVariants };
    });
  }
  
  private async validateDependencies(data: Partial<IProduct>): Promise<void> {
    if (data.categoryIds && data.categoryIds.length > 0) {
      const categoryIdsFormated = data.categoryIds.map((id) => this.toObjectIdString(id));
      const categories = await this.categoryService.findCategoriesByIds(categoryIdsFormated);
      if (categories.length !== data.categoryIds.length) {
        throw new BadRequestError({
          message: "One or more category IDs are invalid.",
          context: { invalid_categories: "Invalid category IDs provided." },
          code: 400,
        });
      }
    }

    if (data.featureIds && data.featureIds.length > 0) {
      const featureIdsFormated = data.featureIds.map((id) => this.toObjectIdString(id));
      const features = await this.featureService.findFeaturesByIds(featureIdsFormated);
      if (features.length !== data.featureIds.length) {
        throw new BadRequestError({
          message: "One or more feature IDs are invalid.",
          context: { invalid_features: "Invalid feature IDs provided." },
          code: 400,
        });
      }
    }

    if (data.createdBy) {
      const user = await this.userService.getById(this.toObjectIdString(data.createdBy));
      if (!user) {
        throw new BadRequestError({
          message: "The user who created this product does not exist.",
          context: { invalid_user: `No user found with ID: ${data.createdBy}` },
          code: 400,
        });
      }
    }

    if (data.images && data.images.length > 0) {
      const imageIdsFormated = data.images.map((id) => this.toObjectIdString(id));
      const images = await this.imageService.findImagesByIds(imageIdsFormated);
      if (images.length !== data.images.length) {
        throw new BadRequestError({
          message: "One or more image IDs are invalid.",
          context: { invalid_images: "Invalid image IDs provided." },
          code: 400,
        });
      }
    }
  }

  private toObjectIdString(id: string | Types.ObjectId): string {
    return typeof id === "string" ? id : id.toString();
  }
}
