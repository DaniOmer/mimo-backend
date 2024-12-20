import { AppConfig } from "../../../../config/app.config";
import { IIventory } from "../../data-access/inventory/inventory.interface";
import { BaseService } from "../../../../librairies/services";
import { InventoryRepository } from "../../data-access/inventory/inventory.repository";
import { ReservedProductService } from "../reservedProduct/reservedProduct.service";
import { ProductService } from "../product.service";
import { ProductVariantService } from "../productVariant/productVariant.service";
import BadRequestError from "../../../../config/error/bad.request.config";
import {
  AddProductInventoryDTO,
  UpdateProductInventoryDTO,
} from "./inventory.dto";

export class InventoryService extends BaseService {
  readonly repository: InventoryRepository;
  readonly reservedStockService: ReservedProductService;
  readonly productService: ProductService;
  readonly productVariantService: ProductVariantService;

  constructor() {
    super("Inventory");
    this.repository = new InventoryRepository();
    this.reservedStockService = new ReservedProductService();
    this.productService = new ProductService();
    this.productVariantService = new ProductVariantService();
  }

  async addInventory(data: Omit<IIventory, "_id">): Promise<IIventory> {
    const product = await this.productService.getProductById(
      data.productId.toString()
    );

    if (!product) {
      throw new BadRequestError({
        message: "Product not found",
        context: { add_product_inventory: "Product not found" },
        code: 404,
      });
    }

    if (data.productVariantId) {
      const productVariant =
        await this.productVariantService.getProductVariantById(
          data.productVariantId.toString()
        );

      if (!productVariant) {
        throw new BadRequestError({
          message: "Product variant not found",
          context: {
            add_product_variant_inventory: "Product variant not found",
          },
          code: 404,
        });
      }

      if (productVariant.productId.toString() !== data.productId.toString()) {
        throw new BadRequestError({
          message: "Product variant does not belong to the specified product",
          context: {
            add_product_variant_inventory:
              "Mismatch between product and variant",
          },
          code: 400,
        });
      }
    }

    const inventory = await this.repository.create(data);
    return inventory;
  }

  async updateInventory(
    id: string,
    data: UpdateProductInventoryDTO
  ): Promise<IIventory> {
    const updatedInventory = await this.repository.updateById(id, data);
    if (!updatedInventory) {
      throw new BadRequestError({
        message: "Inventory not found",
        code: 404,
      });
    }
    return updatedInventory;
  }
}
