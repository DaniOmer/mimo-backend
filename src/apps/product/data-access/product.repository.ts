import mongoose from "mongoose";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";
import BadRequestError from "../../../config/error/bad.request.config";

interface ProductFilterOptions {
  productId?: string;
  isActive?: boolean;
  categoryIds?: string[];
  featureIds?: string[];
  size?: string;
  color?: string;
  min_price?: number;
  max_price?: number;
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

    console.log("matchStage", matchStage);
    if (options.size || options.color) {
      matchStage.hasVariants = true;
    }

    const products = await this.model.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "categories",
          localField: "categoryIds",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "features",
          localField: "featureIds",
          foreignField: "_id",
          as: "features",
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "images",
          foreignField: "_id",
          as: "imageDetails",
        },
      },
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
          from: "sizes",
          localField: "variants.size",
          foreignField: "_id",
          as: "sizes",
        },
      },
      {
        $lookup: {
          from: "colors",
          localField: "variants.color",
          foreignField: "_id",
          as: "colors",
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
            $filter: {
              input: "$variants",
              as: "variant",
              cond: {
                $and: [
                  options.size
                    ? { $in: ["$$variant.size", options.size] }
                    : { $literal: true },
                  options.color
                    ? { $in: ["$$variant.color", options.color] }
                    : { $literal: true },
                ],
              },
            },
          },
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
                    sizeDetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$sizes",
                            as: "size",
                            cond: { $eq: ["$$size._id", "$$variant.size"] },
                          },
                        },
                        0,
                      ],
                    },
                    colorDetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$colors",
                            as: "color",
                            cond: { $eq: ["$$color._id", "$$variant.color"] },
                          },
                        },
                        0,
                      ],
                    },
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
        $addFields: {
          hasVariants: { $gt: [{ $size: "$variants" }, 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          priceEtx: 1,
          priceVat: 1,
          isActive: 1,
          imageDetails: 1,
          categories: 1,
          features: 1,
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
      if (mongoose.Types.ObjectId.isValid(options.productId)) {
        matchStage._id = new mongoose.Types.ObjectId(options.productId);
      } else {
        throw new BadRequestError({
          message: "Invalid productId",
          context: { product_build_stage: options.productId },
        });
      }
    }

    if (options.isActive !== undefined) {
      matchStage.isActive = options.isActive;
    }

    if (options.categoryIds && options.categoryIds.length > 0) {
      matchStage.categoryIds = {
        $in: options.categoryIds.map((id) => {
          if (mongoose.Types.ObjectId.isValid(id)) {
            return new mongoose.Types.ObjectId(id);
          } else {
            throw new BadRequestError({
              message: "Invalid categories",
              context: { product_build_stage: options.productId },
            });
          }
        }),
      };
    }

    if (options.featureIds && options.featureIds.length > 0) {
      matchStage.featureIds = {
        $in: options.featureIds.map((id) => {
          if (mongoose.Types.ObjectId.isValid(id)) {
            return new mongoose.Types.ObjectId(id);
          } else {
            throw new BadRequestError({
              message: "Invalid features",
              context: { product_build_stage: options.productId },
            });
          }
        }),
      };
    }

    return matchStage;
  }
}
