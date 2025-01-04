import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";
import mongoose from "mongoose";

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
    // Récupérer le produit avec ses variantes et l'inventaire associé
    const products = await this.model.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $lookup: {
          from: "product_variants", // Joindre avec la collection des variantes
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },
      {
        $unwind: {
          path: "$variants",
          preserveNullAndEmptyArrays: true, // Gérer les produits sans variantes
        },
      },
      {
        $lookup: {
          from: "inventories", // Joindre avec la collection d'inventaires
          localField: "variants._id", // Utiliser l'ID de la variante
          foreignField: "productVariant",
          as: "inventory",
        },
      },
      {
        $project: {
          name: 1,
          isActive: 1,
          variants: {
            _id: 1,
            priceEtx: 1,
            priceVat: 1,
            sizeId: 1,
            colorId: 1,
            material: 1,
            weight: 1,
            inventory: {
              quantity: 1,
              reservedQuantity: 1,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          isActive: { $first: "$isActive" },
          variants: { $push: "$variants" },
        },
      },
    ]);

    return products;
  }
}
