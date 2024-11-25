import { IsNotEmpty, IsString, IsDate, IsEnum, IsOptional, MaxLength, MinLength } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "../data-access/order.interface";
import 'reflect-metadata';

export class OrderCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly orderNumber!: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly orderDate!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  shipDate?: Date;

  @IsNotEmpty()
  @IsEnum(OrderStatus, { message: `Status must be one of: ${Object.values(OrderStatus).join(", ")}` })
  status!: OrderStatus;
}