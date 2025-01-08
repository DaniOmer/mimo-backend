import { Request, Response, NextFunction } from "express";

import { BaseController } from "../../../librairies/controllers";
import { PreferenceService } from "../domain/preference.service";
import { ApiResponse } from "../../../librairies/controllers";

export class PreferenceController extends BaseController {
  readonly preferenceService: PreferenceService;

  constructor() {
    super();
    this.preferenceService = new PreferenceService();
  }

  async getUserPreferences(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const preferenceId = req.params.userId;
      const preferences = await this.preferenceService.getPreferenceByUser(
        preferenceId,
        currentUser
      );
      ApiResponse.success(
        res,
        "User preferences fetched successfully",
        preferences,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async updateUserPreference(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const preferenceData = req.body;
      const preferenceId = req.params.id;
      const updatedPreference = await this.preferenceService.updatePreference(
        preferenceId,
        preferenceData,
        currentUser
      );
      ApiResponse.success(
        res,
        "User preference updated successfully",
        updatedPreference,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteUserPreference(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const preferenceId = req.params.id;
      await this.preferenceService.deletePreference(preferenceId);
      ApiResponse.success(res, "User preference deleted successfully", {}, 200);
    } catch (error) {
      next(error);
    }
  }
}
