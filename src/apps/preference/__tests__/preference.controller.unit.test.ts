import { PreferenceController } from "../api/preference.controller";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../librairies/controllers";

jest.mock("../domain/preference.service.ts");
jest.mock("../../../librairies/controllers");

describe("PreferenceController", () => {
  let preferenceController: PreferenceController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    preferenceController = new PreferenceController();
    mockReq = {
      params: {},
      body: {},
      user: { id: "user1", _id: "user1" },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("getUserPreferences", () => {
    it("should return user preferences on success", async () => {
      const mockPreferences = {
        user: "userId123",
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        marketingConsent: true,
        cookiesConsent: false,
        personalizedAds: true,
        language: "en",
        currency: "USD",
      };

      (
        preferenceController.preferenceService.getPreferenceByUser as jest.Mock
      ).mockResolvedValue(mockPreferences);

      mockReq.params = { userId: "userId123" };
      await preferenceController.getUserPreferences(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(
        preferenceController.preferenceService.getPreferenceByUser
      ).toHaveBeenCalledWith("userId123", mockReq.user);
      expect(ApiResponse.success).toHaveBeenCalledWith(
        mockRes,
        "User preferences fetched successfully",
        mockPreferences,
        200
      );
    });

    it("should call next with an error if service fails", async () => {
      const mockError = new Error("Service failure");
      (
        preferenceController.preferenceService.getPreferenceByUser as jest.Mock
      ).mockRejectedValue(mockError);

      await preferenceController.getUserPreferences(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("updateUserPreference", () => {
    it("should update user preference and return the updated preference", async () => {
      const mockUpdatedPreference = {
        user: "userId123",
        notifications: {
          email: false,
          sms: true,
          push: false,
        },
        marketingConsent: false,
        cookiesConsent: true,
        personalizedAds: false,
        language: "fr",
        currency: "EUR",
      };

      (
        preferenceController.preferenceService.updatePreference as jest.Mock
      ).mockResolvedValue(mockUpdatedPreference);

      mockReq.params = { id: "pref1" };
      mockReq.body = {
        notifications: { email: false, sms: true, push: false },
        language: "fr",
        currency: "EUR",
      };

      await preferenceController.updateUserPreference(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(
        preferenceController.preferenceService.updatePreference
      ).toHaveBeenCalledWith("pref1", mockReq.body, mockReq.user);
      expect(ApiResponse.success).toHaveBeenCalledWith(
        mockRes,
        "User preference updated successfully",
        mockUpdatedPreference,
        200
      );
    });

    it("should call next with an error if service fails", async () => {
      const mockError = new Error("Service failure");
      (
        preferenceController.preferenceService.updatePreference as jest.Mock
      ).mockRejectedValue(mockError);

      await preferenceController.updateUserPreference(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe("deleteUserPreference", () => {
    it("should delete user preference and return success", async () => {
      (
        preferenceController.preferenceService.deletePreference as jest.Mock
      ).mockResolvedValue(null);

      mockReq.params = { id: "pref1" };

      await preferenceController.deleteUserPreference(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(
        preferenceController.preferenceService.deletePreference
      ).toHaveBeenCalledWith("pref1");
      expect(ApiResponse.success).toHaveBeenCalledWith(
        mockRes,
        "User preference deleted successfully",
        {},
        200
      );
    });

    it("should call next with an error if service fails", async () => {
      const mockError = new Error("Service failure");
      (
        preferenceController.preferenceService.deletePreference as jest.Mock
      ).mockRejectedValue(mockError);

      await preferenceController.deleteUserPreference(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
