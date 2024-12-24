import { BaseService } from "../../../../librairies/services/base.service";
import { ProductImageRepository } from "../../data-access/productImage/productImage.repository";
import { IProductImage } from "../../data-access/productImage/productImage.interface";

export class ProductImageService extends BaseService {
  private repository: ProductImageRepository;

  constructor() {
    super("ProductImage");
    this.repository = new ProductImageRepository();
  }

  async createProductImage(data: Partial<IProductImage>): Promise<IProductImage> {
    return this.repository.create(data);
  }

  async getImagesByProductId(productId: string): Promise<IProductImage[]> {
    return this.repository.findByProductId(productId);
  }

  async updateProductImageById(id: string, updates: Partial<IProductImage>): Promise<IProductImage> {
    const updatedImage = await this.repository.updateById(id, updates);
    return this.validateDataExists(updatedImage, id);
  }

  async deleteProductImageById(id: string): Promise<IProductImage> {
    const deletedImage = await this.repository.deleteById(id);
    return this.validateDataExists(deletedImage, id);
  }

  
  async findImagesByIds(imageIds: string[]): Promise<IProductImage[]> {
    return this.repository.findByIds(imageIds);

  }
}
