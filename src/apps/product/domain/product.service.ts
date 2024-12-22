import { BaseService } from "../../../librairies/services";
import { ProductRepository, IProduct } from "../data-access";
import { CategoryService, ProductFeatureService, ProductImageService, ProductVariantService } from "./";
import { UserService } from "../../auth/domain/user/user.service";
import { Types } from "mongoose";
import BadRequestError from "../../../config/error/bad.request.config";

export class ProductService extends BaseService {
  private repository: ProductRepository;
  private categoryService: CategoryService;
  private featureService: ProductFeatureService;
  private imageService: ProductImageService;
  private userService: UserService;
  // private productVariantService: ProductVariantService;

  constructor() {
    super("Product");
    this.repository = new ProductRepository();
    this.categoryService = new CategoryService();
    this.featureService = new ProductFeatureService();
    this.imageService = new ProductImageService();
    this.userService = new UserService();
    // this.productVariantService = new ProductVariantService();
    
  }

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    await this.validateDependencies(data);
    return this.repository.create(data);
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.repository.getById(id);
    return this.validateDataExists(product, id);
  }

  async getAllProducts(): Promise<IProduct[]> {
    return this.repository.getAll();
  }

  async updateProductById(
    id: string,
    updates: Partial<IProduct>
  ): Promise<IProduct> {
    const updatedProduct = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedProduct, id);
  }

  async deleteProductById(id: string): Promise<IProduct> {
    const deletedProduct = await this.repository.deleteById(id);
    return this.validateDataExists(deletedProduct, id);
  }

  /**
   * Valide les dépendances (catégories, caractéristiques, images, utilisateurs)
   * @param data - Données du produit
   */
  private async validateDependencies(data: Partial<IProduct>): Promise<void> {
    if (data.categoryIds && data.categoryIds.length > 0) {
      for (const categoryId of data.categoryIds) {
        await this.categoryService.getCategoryById(this.toObjectIdString(categoryId));
      }
    }

    if (data.featureIds && data.featureIds.length > 0) {
      for (const featureId of data.featureIds) {
        await this.featureService.getFeatureById(this.toObjectIdString(featureId));
      }
    }

    if (data.createdBy) {
      await this.userService.getUserById(this.toObjectIdString(data.createdBy));
    }

    if (data.images && data.images.length > 0) {
      for (const imageId of data.images) {
        await this.imageService.getImagesByProductId(this.toObjectIdString(imageId));
      }
    }
  }

  // /**
  //  * Vérifie la disponibilité des stocks pour une variante de produit
  //  * @param variantId - ID de la variante
  //  * @param quantity - Quantité demandée
  //  */
  //  async checkStock(variantId: string, quantity: number): Promise<boolean> {
  //   const variant = await this.productVariantService.getVariantById(variantId);
  //   const availableStock = variant.quantity - variant.reservedStock;

  //   if (quantity > availableStock) {
  //     return false; 
  //   }
  //   return true;
  // }

  // /**
  //  * Réserve le stock pour une variante de produit
  //  * @param variantId - ID de la variante
  //  * @param quantity - Quantité à réserver
  //  */
  // async reservedStock(variantId: string, quantity: number): Promise<void> {
  //   const variant = await this.productVariantService.getVariantById(variantId);
  //   const availableStock = variant.quantity - variant.reservedStock;

  //   if (quantity > availableStock) {
  //     throw new BadRequestError({
  //       message: `Insufficient stock for variant ID: ${variantId}`,
  //       code: 400,
  //     });
  //   }

  //   await this.productVariantService.updateVariantById(variantId, {
  //     reservedStock: variant.reservedStock + quantity,
  //   });
  // }

  // /**
  //  * Restaure le stock réservé d'une variante
  //  * @param variantId - ID de la variante
  //  * @param quantity - Quantité à restaurer
  //  */
  // async restoreStock(variantId: string, quantity: number): Promise<void> {
  //   const variant = await this.productVariantService.getVariantById(variantId);

  //   if (quantity > variant.reservedStock) {
  //     throw new BadRequestError({
  //       message: `Cannot restore more stock than reserved for variant ID: ${variantId}`,
  //       code: 400,
  //     });
  //   }
  //   await this.productVariantService.updateVariantById(variantId, {
  //     reservedStock: variant.reservedStock - quantity,
  //   });
  // }

  /**
   * Convertit un ID en chaîne de caractères.
   * @param id - L'ID à convertir
   */
  private toObjectIdString(id: string | Types.ObjectId): string {
    return typeof id === "string" ? id : id.toString();
  }
}
