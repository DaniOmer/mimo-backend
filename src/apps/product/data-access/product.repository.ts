import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";

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

  async findAllWithRelations(): Promise<IProduct[]> {
    return this.model
      .find()
      .populate("images")
      .populate("categoryIds")
      .populate("featureIds")
      .exec();
  }

  async findByCriteria(query: any): Promise<IProduct[]> {
    return this.model.find(query).exec();
  }

  async findByStatus(isActive: boolean): Promise<IProduct[]> {
    return this.model.find({ isActive }).exec();
  }

  async getProductsWithVariantsAndInventory(): Promise<IProduct[]> {
    const products = await this.model.aggregate([
      {
        $match: { isActive: true },
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

    return products;
  }
}
