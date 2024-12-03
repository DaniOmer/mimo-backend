import { MongooseRepository } from "../../../../librairies/repositories/mongoose/mongoose.repository";
import { ColorModel } from "./color.model";
import { IColor } from "./color.interface";

export class ColorRepository extends MongooseRepository<IColor> {
  constructor() {
    super(ColorModel);
  }
}
