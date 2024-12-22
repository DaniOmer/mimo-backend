import { BaseService } from "../../../../librairies/services";
import { IReservedProduct } from "../../data-access/reservedProduct/reservedProduct.interface";
import { ReservedProductRepository } from "../../data-access/reservedProduct/reservedProduct.repository";
import BadRequestError from "../../../../config/error/bad.request.config";

export class ReservedProductService extends BaseService {
  private repository: ReservedProductRepository;

  constructor() {
    super("ReservedProduct");
    this.repository = new ReservedProductRepository();
  }

  async getReservedProductByInventory(
    inventoryId: string
  ): Promise<IReservedProduct[] | null> {
    return await this.repository.getAllByInventoryId(inventoryId);
  }

  async getReservedProductByInventoryAndUserId(
    inventoryId: string,
    userId: string
  ): Promise<IReservedProduct | null> {
    const reservedProduct = await this.repository.getByInventoryAndUserId(
      inventoryId,
      userId
    );
    return reservedProduct;
  }

  async addReservedProduct(data: any): Promise<IReservedProduct> {
    const reservedProduct = await this.repository.create(data);
    if (!reservedProduct) {
      throw new BadRequestError({
        message: "Failed to create reserved product",
        logging: true,
      });
    }
    return reservedProduct;
  }

  async updateReservedProduct(
    data: IReservedProduct
  ): Promise<IReservedProduct> {
    const updatedReservedProduct = await this.repository.updateById(
      data._id,
      data
    );
    if (!updatedReservedProduct) {
      throw new BadRequestError({
        message: "Reserved product not found",
        code: 404,
      });
    }
    return updatedReservedProduct;
  }

  async deleteReservedProduct(id: string): Promise<IReservedProduct | null> {
    const deletedReservedProduct = await this.repository.deleteById(id);
    if (!deletedReservedProduct) {
      throw new BadRequestError({
        message: "Reserved product not found",
        code: 404,
      });
    }
    return deletedReservedProduct;
  }
}
