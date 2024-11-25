import { IToken } from "./token.interface";
import { TokenModel } from "./token.model";
import { MongooseRepository } from "../../../librairies/repositories/mongoose/mongoose.repository";

export default class TokenRepository extends MongooseRepository<IToken> {
  constructor() {
    super(TokenModel);
  }
}