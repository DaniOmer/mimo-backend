import {
  IsBoolean,
  IsOptional,
  IsString,
  IsIn,
  IsISO31661Alpha2,
} from "class-validator";
import { Expose } from "class-transformer";

export class PreferenceDTO {
  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly notificationsEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly notificationsSms?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly notificationsPush?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly marketingConsent?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly personalizedAds?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["en", "fr", "es", "de"])
  @Expose()
  readonly language?: string;

  @IsOptional()
  @IsString()
  @IsISO31661Alpha2()
  @Expose()
  readonly currency?: string;
}
