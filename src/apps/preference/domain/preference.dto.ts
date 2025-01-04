import {
  IsBoolean,
  IsOptional,
  IsString,
  IsIn,
  IsISO31661Alpha2,
} from "class-validator";

export class PreferenceDTO {
  @IsOptional()
  @IsBoolean()
  readonly notificationsEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly notificationsSms?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly notificationsPush?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly marketingConsent?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly personalizedAds?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(["en", "fr", "es", "de"])
  readonly language?: string;

  @IsOptional()
  @IsString()
  @IsISO31661Alpha2()
  readonly currency?: string;
}
