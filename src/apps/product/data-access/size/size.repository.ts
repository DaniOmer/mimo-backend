import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { SizeModel } from "./size.model";
import { ISize } from "./size.interface";

export class SizeRepository extends MongooseRepository<ISize> {
  constructor() {
    super(SizeModel);
  }
}
