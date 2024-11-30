import { ObjectId } from "mongoose";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
} from "class-validator";

export class RoleCreateDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  permissions!: ObjectId[];
}
