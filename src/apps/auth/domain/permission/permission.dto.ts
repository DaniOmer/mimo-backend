import { IsString, IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";

export class PermissionCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name!: string;
}
