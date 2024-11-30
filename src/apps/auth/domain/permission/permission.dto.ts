import { IsString, IsNotEmpty } from "class-validator";

export class PermissionCreateDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
