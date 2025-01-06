import mongoose from "mongoose";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";

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
    console.log(options.categoryIds);

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
      // {
      //   $match: {
      //     $or: [
      //       {
      //         hasVariants: false,
      //         priceVat: {
      //           ...(options.min_price !== undefined
      //             ? { $gte: options.min_price }
      //             : {}),
      //           ...(options.max_price !== undefined
      //             ? { $lte: options.max_price }
      //             : {}),
      //         },
      //       },
      //       {
      //         hasVariants: true,
      //         "variants.priceVat": {
      //           ...(options.min_price !== undefined
      //             ? { $gte: options.min_price }
      //             : {}),
      //           ...(options.max_price !== undefined
      //             ? { $lte: options.max_price }
      //             : {}),
      //         },
      //       },
      //     ],
      //   },
      // },
      {
        $project: {
          _id: 1,
          name: 1,
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
      matchStage._id = new mongoose.Types.ObjectId(options.productId);
    }

    if (options.isActive !== undefined) {
      matchStage.isActive = options.isActive;
    }

    if (options.categoryIds) {
      matchStage.categoryIds = { $in: options.categoryIds };
    }
    console.log(matchStage);

    if (options.featureIds) {
      matchStage.featureIds = { $in: options.featureIds };
    }

    return matchStage;
  }
}
