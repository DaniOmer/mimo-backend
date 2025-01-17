import { IIventory } from "../../data-access/inventory/inventory.interface";
import { BaseService } from "../../../../librairies/services";
import { InventoryRepository } from "../../data-access/inventory/inventory.repository";
import { ReservedProductService } from "../reservedProduct/reservedProduct.service";
import { ProductService } from "../product.service";
import { ProductVariantService } from "../productVariant/productVariant.service";
import BadRequestError from "../../../../config/error/bad.request.config";
import { IProduct, IProductVariant } from "../../data-access";
import { IReservedProduct } from "../../data-access/reservedProduct/reservedProduct.interface";

export enum ReleaseType {
  CANCEL = "cancel",
  FINALIZED = "finalize",
}
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
        data.productVariant ? data.productVariant.toString() : null
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
    if (product.hasVariants) {
      if (!data.productVariant) {
        throw new BadRequestError({
          message: "Product has variants and product variant is not provided",
          context: {
            add_product_variant_inventory:
              "Product has variants and product variant is not provided",
          },
          code: 400,
        });
      }

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

      const productVariantProduct = productVariant.product as IProduct;
      if (productVariantProduct._id.toString() !== data.product.toString()) {
        throw new BadRequestError({
          message: "Product variant does not belong to the specified product",
          context: {
            add_product_variant_inventory:
              "Mismatch between product and variant",
          },
          code: 400,
        });
      }
    } else {
      if (data.productVariant) {
        throw new BadRequestError({
          message: "Product should not have variants",
          context: {
            add_product_inventory: "Product does not have variants",
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

  validateInventoryStock(
    inventory: IIventory,
    requestedReservedQuantity: number,
    currentReservedQuantity: number = 0
  ): void {
    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
    const difference = requestedReservedQuantity - currentReservedQuantity;

    if (difference <= 0) {
      return;
    }
    if (availableQuantity < difference) {
      throw new BadRequestError({
        message: "Not enough stock available",
        code: 400,
      });
    }
  }

  async reserveStock(
    inventory: IIventory,
    requestedReservedQuantity: number,
    userId: string
  ): Promise<void> {
    const inventoryId = inventory._id;

    const reservedStock =
      await this.reservedStockService.getReservedProductByInventoryAndUserId(
        inventoryId,
        userId
      );

    if (reservedStock) {
      const currentReservedQuantity = reservedStock.quantity;
      const difference = requestedReservedQuantity - currentReservedQuantity;
      if (currentReservedQuantity + difference < 0) {
        throw new BadRequestError({
          message: "Cannot reserve less stock than currently reserved",
          context: { update_cart_item: "Failed to reserve item quantity" },
          code: 400,
        });
      }

      this.validateInventoryStock(
        inventory,
        requestedReservedQuantity,
        reservedStock.quantity
      );
      const newQuantity = currentReservedQuantity + difference;
      await this.reservedStockService.updateReservedProduct(reservedStock._id, {
        quantity: newQuantity,
      });

      const newInventoryReservedQuantity =
        inventory.reservedQuantity + difference;
      await this.repository.updateById(inventoryId, {
        reservedQuantity: newInventoryReservedQuantity,
      });
      return;
    }

    this.validateInventoryStock(inventory, requestedReservedQuantity);
    await this.reservedStockService.addReservedProduct({
      inventoryId,
      quantity: requestedReservedQuantity,
      reservedById: userId,
    });

    const newInventoryReservedQuantity =
      inventory.reservedQuantity + requestedReservedQuantity;
    await this.repository.updateById(inventoryId, {
      reservedQuantity: newInventoryReservedQuantity,
    });
  }

  async releaseStock(
    inventory: IIventory,
    userId: string,
    type: ReleaseType
  ): Promise<void> {
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

    let updatedInventory;
    if (type === ReleaseType.CANCEL) {
      updatedInventory = await this.handleCancelStock(inventory, reservedStock);
    } else if (type === ReleaseType.FINALIZED) {
      updatedInventory = await this.handleFinalizeStock(
        inventory,
        reservedStock
      );
    } else {
      throw new BadRequestError({
        message: "Invalid stock release type provided",
        code: 400,
      });
    }

    if (!updatedInventory) {
      throw new BadRequestError({
        message: "Failed to update inventory after releasing stock",
        context: { inventory_workflow: "Failed to update inventory" },
        code: 500,
      });
    }

    await this.reservedStockService.deleteReservedProduct(reservedStock._id);
  }

  private async handleCancelStock(
    inventory: IIventory,
    reservedStock: IReservedProduct
  ): Promise<IIventory | null> {
    const updatedInventoryQuantity =
      inventory.quantity + reservedStock.quantity;
    const updatedInventoryReservedQuantity =
      inventory.reservedQuantity - reservedStock.quantity;

    return this.repository.updateById(inventory._id, {
      quantity: updatedInventoryQuantity,
      reservedQuantity: updatedInventoryReservedQuantity,
    });
  }

  private async handleFinalizeStock(
    inventory: IIventory,
    reservedStock: IReservedProduct
  ): Promise<IIventory | null> {
    const updatedInventoryQuantity =
      inventory.quantity - reservedStock.quantity;
    const updatedInventoryReservedQuantity =
      inventory.reservedQuantity - reservedStock.quantity;

    return this.repository.updateById(inventory._id, {
      quantity: updatedInventoryQuantity,
      reservedQuantity: updatedInventoryReservedQuantity,
    });
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
    productVariantId: string | null
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
    if (product.hasVariants && !productVariantId) {
      throw new BadRequestError({
        message: "Product has variants, please provide a product variant",
        logging: true,
      });
    } else if (!product.hasVariants && productVariantId) {
      throw new BadRequestError({
        message:
          "Product does not have variants, please do not provide a product variant",
        logging: true,
      });
    } else if (productVariantId) {
      productVariant = await this.productVariantService.getProductVariantById(
        productVariantId
      );
      if (!productVariant) {
        throw new BadRequestError({
          message: "Product variant not found",
          logging: true,
        });
      }

      const productVariantProduct = productVariant.product as IProduct;
      if (product._id.toString() !== productVariantProduct._id.toString()) {
        throw new BadRequestError({
          message: "Product variant does not belong to the product",
          logging: true,
        });
      }
    }

    return { product, productVariant };
  }
}
