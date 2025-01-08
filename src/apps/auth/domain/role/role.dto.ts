import { ObjectId } from "mongoose";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
} from "class-validator";
import { Expose } from "class-transformer";

export class RoleCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Expose()
  permissions!: ObjectId[];
}
