import { ICart } from "./cart.interface";
import { CartModel } from "./cart.model";
import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";

export class CartRepository extends MongooseRepository<ICart> {
  constructor() {
    super(CartModel);
  }

  async getCartByUserId(user: string): Promise<ICart | null> {
    return await this.model.findOne({ user: user }).exec();
  }
}
