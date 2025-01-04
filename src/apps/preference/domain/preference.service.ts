import { BaseService } from "../../../librairies/services";
import BadRequestError from "../../../config/error/bad.request.config";
import { PreferenceRepository } from "../data-access/preference.repository";
import { PreferenceDTO } from "./preference.dto";
import { SecurityUtils, UserDataToJWT } from "../../../utils";
import { IUserPreference } from "../data-access/preference.interface";
import { IUser } from "../../auth/data-access";

export class PreferenceService extends BaseService {
  readonly repository: PreferenceRepository;

  constructor() {
    super("Preference");
    this.repository = new PreferenceRepository();
  }

  async getPreferenceByUserForRegister(
    userId: string
  ): Promise<IUserPreference | null> {
    const preference = await this.repository.getPreferenceByUser(userId);
    return preference;
  }

  async getPreferenceByUser(
    userId: string,
    currentUser: UserDataToJWT
  ): Promise<IUserPreference> {
    const preference = await this.repository.getPreferenceByUser(userId);
    if (!preference) {
      throw new BadRequestError({
        message: "Preference not found",
        logging: true,
      });
    }

    this.checkPreferenceOwner(preference, currentUser);
    return preference;
  }

  async createDefaultPreference(user: IUser): Promise<IUserPreference> {
    const defaultValue = user.isDefaultPreference;
    const preferenceData = {
      user: user._id,
      notifications: {
        email: defaultValue,
        sms: defaultValue,
        push: defaultValue,
      },
      marketingConsent: defaultValue,
      personalizedAds: defaultValue,
      language: "fr",
      currency: "EUR",
    };
    const defaultPreference = await this.repository.create(preferenceData);

    if (!defaultPreference) {
      throw new BadRequestError({
        message: "Failed to create user preferences",
        logging: true,
      });
    }
    return defaultPreference;
  }

  async updatePreference(
    id: string,
    data: PreferenceDTO,
    currentUser: UserDataToJWT
  ): Promise<IUserPreference> {
    const existingPreference = await this.repository.getById(id);
    if (!existingPreference) {
      throw new BadRequestError({
        message: "Preference not found",
        logging: true,
      });
    }
    this.checkPreferenceOwner(existingPreference, currentUser);
    const updatedPreference = await this.repository.updateById(id, data);

    if (!updatedPreference) {
      throw new BadRequestError({
        message: "Failed to update user preferences",
        logging: true,
      });
    }

    return updatedPreference;
  }

  async deletePreference(id: string): Promise<void> {
    const preference = await this.repository.getById(id);
    if (!preference) {
      throw new BadRequestError({
        message: "Preferences not found for the given ID",
        logging: true,
      });
    }

    const deleteResult = await this.repository.deleteById(id);
    if (!deleteResult) {
      throw new BadRequestError({
        message: "Failed to delete user preferences",
        logging: true,
      });
    }
  }

  checkPreferenceOwner(
    preference: IUserPreference,
    currentUser: UserDataToJWT
  ): void {
    const preferenceOwner = preference.user.toString();
    const hasAccess = SecurityUtils.isOwnerOrAdmin(
      preferenceOwner,
      currentUser
    );
    if (!hasAccess) {
      throw new BadRequestError({
        message: "Unauthorized to fetch this preference",
        logging: true,
        code: 403,
      });
    }
  }
}
