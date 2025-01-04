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

  async updateUserPreference(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentUser = req.user;
      const preferenceData = req.body;
      const preferenceId = req.params.id;
      const updatedPreference = this.preferenceService.updatePreference(
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
}
