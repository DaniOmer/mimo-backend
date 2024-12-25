import { AppConfig } from "../../../../config/app.config";
import { IIventory } from "../../data-access/inventory/inventory.interface";
import { BaseService } from "../../../../librairies/services";
import { InventoryRepository } from "../../data-access/inventory/inventory.repository";
import { ReservedProductService } from "../reservedProduct/reservedProduct.service";
import { ProductService } from "../product.service";
import { ProductVariantService } from "../productVariant/productVariant.service";
import BadRequestError from "../../../../config/error/bad.request.config";
import { IProduct, IProductVariant } from "../../data-access";

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
    const existingInventory =
      await this.repository.getInventoryByProductAndVariantId(
        data.product.toString(),
        data.productVariant && data.productVariant.toString()
      );
    if (existingInventory) {
      throw new BadRequestError({
        message: "Inventory already exists for this product and variant",
        context: {
          add_inventory: "Inventory already exists",
        },
        code: 400,
      });
    }

    const product = await this.productService.getProductById(
      data.product.toString()
    );

    if (!product) {
      throw new BadRequestError({
        message: "Product not found",
        context: { add_product_inventory: "Product not found" },
        code: 404,
      });
    }

    if (data.productVariant) {
      const productVariant =
        await this.productVariantService.getProductVariantById(
          data.productVariant.toString()
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

      if (productVariant.productId.toString() !== data.product.toString()) {
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
    data: Pick<IIventory, "quantity">
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

  async validateInventoryStock(
    product: IProduct,
    productVariant: IProductVariant | null,
    quantity: number
  ): Promise<void> {
    const inventory = await this.repository.getInventoryByProductAndVariantId(
      product._id.toString(),
      productVariant?._id?.toString()
    );
    if (!inventory) {
      throw new BadRequestError({
        message: "Inventory not found",
        code: 404,
      });
    }

    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
    if (availableQuantity < quantity) {
      throw new BadRequestError({
        message: "Not enough stock available",
        code: 400,
      });
    }
    // return inventory;
  }

  async reserveStock(
    inventory: IIventory,
    quantity: number,
    userId: string
  ): Promise<void> {
    const inventoryId = inventory._id;
    const reservationDuration = this.getReservationDuration();
    const reservedUntil = new Date(Date.now() + reservationDuration);

    const newReservedStock = await this.reservedStockService.addReservedProduct(
      {
        inventoryId,
        quantity,
        reservedById: userId,
        reservedUntil,
      }
    );

    if (!newReservedStock) {
      throw new BadRequestError({
        message: "Failed to reserve stock",
        context: { inventory_workflow: "Failed to addReservedProduct" },
        code: 500,
      });
    }

    const newInventoryReservedQuantity = inventory.reservedQuantity + quantity;
    const updatedInventory = await this.repository.updateById(inventoryId, {
      reservedQuantity: newInventoryReservedQuantity,
    });

    if (!updatedInventory) {
      throw new BadRequestError({
        message: "Failed to update inventory after reservation",
        context: { inventory_workflow: "Failed to update inventory" },
        code: 500,
      });
    }
  }

  async releaseStock(inventoryId: string, userId: string): Promise<void> {
    const inventory = await this.repository.getById(inventoryId);
    if (!inventory) {
      throw new BadRequestError({
        message: "Inventory not found",
        code: 404,
      });
    }

    const reservedStock =
      await this.reservedStockService.getReservedProductByInventoryAndUserId(
        inventory._id,
        userId
      );

    if (!reservedStock) {
      throw new BadRequestError({
        message: "No reserved stock found for this user",
        code: 404,
      });
    }

    const updatedInventoryQuantity =
      inventory.quantity + reservedStock.quantity;
    const updatedInventoryReservedQuantity =
      inventory.reservedQuantity - reservedStock.quantity;
    const updatedInventory = await this.repository.updateById(inventoryId, {
      quantity: updatedInventoryQuantity,
      reservedQuantity: updatedInventoryReservedQuantity,
    });

    if (!updatedInventory) {
      throw new BadRequestError({
        message: "Failed to update inventory after releasing stock",
        context: { inventory_workflow: "Failed to update inventory" },
        code: 500,
      });
    }

    await this.reservedStockService.deleteReservedProduct(reservedStock._id);
  }

  private getReservationDuration(): number {
    const expirationTime = parseInt(AppConfig.cart.product.expirationTime, 10);
    if (isNaN(expirationTime) || expirationTime <= 0) {
      throw new BadRequestError({
        message: "Invalid product expiration time",
        code: 400,
      });
    }

    return expirationTime * 1000;
  }

  async getLowQuantityProductsByThershold(
    threshold: number
  ): Promise<IIventory[]> {
    const inventories = await this.repository.getLowQuantityProducts(threshold);
    return inventories;
  }

  async getInventoriesWithProductAndVariant(): Promise<IIventory[]> {
    const inventories =
      await this.repository.getInventoriesWithProductAndVariant();
    return inventories;
  }

  async getInventoryByProductAndVariantId(
    productId: string,
    productVariantId: string | undefined
  ): Promise<IIventory> {
    const inventory = await this.repository.getInventoryByProductAndVariantId(
      productId,
      productVariantId
    );
    if (!inventory) {
      throw new BadRequestError({
        message: "No inventory found for the product",
        logging: true,
        code: 404,
      });
    }
    return inventory;
  }

  async validateProductAndVariant(
    productId: string,
    productVariantId?: string | null
  ): Promise<{ product: IProduct; productVariant: IProductVariant | null }> {
    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw new BadRequestError({
        message: "Product not found",
        logging: true,
      });
    }

    let productVariant = null;
    if (productVariantId) {
      productVariant = await this.productVariantService.getProductVariantById(
        productVariantId
      );
      if (!productVariant) {
        throw new BadRequestError({
          message: "Product variant not found",
          logging: true,
        });
      }

      if (product._id.toString() !== productVariant.productId.toString()) {
        throw new BadRequestError({
          message: "Product variant does not belong to the product",
          logging: true,
        });
      }
    }

    return { product, productVariant };
  }
}
