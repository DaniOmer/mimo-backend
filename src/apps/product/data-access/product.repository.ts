import mongoose from "mongoose";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";

interface ProductFilterOptions {
  productId?: string;
  isActive?: boolean;
}

export class ProductRepository extends MongooseRepository<IProduct> {
  constructor() {
    super(ProductModel);
  }

  async findByIdWithRelations(productId: string): Promise<IProduct | null> {
    return this.model
      .findById(productId)
      .populate("images")
      .populate("categoryIds")
      .populate("featureIds")
      .exec();
  }

  async findByCriteria(query: any): Promise<IProduct[]> {
    return this.model
      .find(query)
      .populate("categoryIds")
      .populate("featureIds")
      .populate("images")
      .exec();
  }

  async findByStatus(isActive: boolean): Promise<IProduct[]> {
    return this.model.find({ isActive }).exec();
  }

  async getProductWithVariantsAndInventory(
    options: ProductFilterOptions = {}
  ): Promise<IProduct | IProduct[] | null> {
    const matchStage = this.buildMatchStage(options);

    const products = await this.model.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "product_variants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },
      {
        $lookup: {
          from: "inventories",
          let: { variantIds: "$variants._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$productVariant", "$$variantIds"] },
              },
            },
          ],
          as: "variantsInventories",
        },
      },
      {
        $addFields: {
          variants: {
            $map: {
              input: "$variants",
              as: "variant",
              in: {
                $mergeObjects: [
                  "$$variant",
                  {
                    inventory: {
                      $filter: {
                        input: "$variantsInventories",
                        as: "inv",
                        cond: {
                          $eq: ["$$inv.productVariant", "$$variant._id"],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "inventories",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$product", "$$productId"] }],
                },
              },
            },
          ],
          as: "inventory",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          isActive: 1,
          images: 1,
          categoryIds: 1,
          featureIds: 1,
          createdBy: 1,
          updatedBy: 1,
          stripeId: 1,
          hasVariants: 1,
          variants: {
            $cond: [{ $eq: ["$hasVariants", true] }, "$variants", "$$REMOVE"],
          },
          inventory: {
            $cond: [{ $eq: ["$hasVariants", false] }, "$inventory", "$$REMOVE"],
          },
        },
      },
    ]);

    return options.productId ? products[0] : products;
  }

  private buildMatchStage(options: ProductFilterOptions): any {
    const matchStage: any = {};

    if (options.productId) {
      matchStage._id = new mongoose.Types.ObjectId(options.productId);
    }

    if (options.isActive !== undefined) {
      matchStage.isActive = options.isActive;
    }

    if (!options.productId && options.isActive === undefined) {
      matchStage.isActive = true;
    }
    return matchStage;
  }
}
