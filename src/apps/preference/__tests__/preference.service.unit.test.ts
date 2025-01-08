import { ObjectId } from "mongodb";
import { PreferenceService } from "../domain/preference.service";
import BadRequestError from "../../../config/error/bad.request.config";
import { SecurityUtils } from "../../../utils";
import { IUserPreference } from "../data-access/preference.interface";
import { IUser } from "../../auth/data-access";
import { UserDataToJWT } from "../../../utils";

jest.mock("../data-access/preference.repository");
jest.mock("../../../utils/security.utils.ts");

describe("PreferenceService", () => {
  let preferenceService: PreferenceService;

  beforeEach(() => {
    preferenceService = new PreferenceService();
  });

  describe("getPreferenceByUserForRegister", () => {
    it("should return the preference if it exists", async () => {
      const mockPreference = {
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
        currency: "EUR",
      };
      (
        preferenceService.repository.getPreferenceByUser as jest.Mock
      ).mockResolvedValue(mockPreference);

      const result = await preferenceService.getPreferenceByUserForRegister(
        "userId123"
      );
      expect(result).toBe(mockPreference);
      expect(
        preferenceService.repository.getPreferenceByUser
      ).toHaveBeenCalledWith("userId123");
    });

    it("should return null if the preference does not exist", async () => {
      (
        preferenceService.repository.getPreferenceByUser as jest.Mock
      ).mockResolvedValue(null);

      const result = await preferenceService.getPreferenceByUserForRegister(
        "userId123"
      );
      expect(result).toBeNull();
    });
  });

  describe("getPreferenceByUser", () => {
    it("should return the preference if it exists and the user has access", async () => {
      const mockPreference = { user: "userId123" } as IUserPreference;
      const mockCurrentUser: UserDataToJWT = {
        _id: "userId123",
        roles: [{ name: "admin" }],
        permissions: [{ name: "read" }, { name: "write" }],
      };
      (
        preferenceService.repository.getPreferenceByUser as jest.Mock
      ).mockResolvedValue(mockPreference);
      jest.spyOn(SecurityUtils, "isOwnerOrAdmin").mockReturnValue(true);

      const result = await preferenceService.getPreferenceByUser(
        "userId123",
        mockCurrentUser
      );
      expect(result).toBe(mockPreference);
      expect(
        preferenceService.repository.getPreferenceByUser
      ).toHaveBeenCalledWith("userId123");
    });

    it("should throw BadRequestError if preference does not exist", async () => {
      (
        preferenceService.repository.getPreferenceByUser as jest.Mock
      ).mockResolvedValue(null);

      await expect(
        preferenceService.getPreferenceByUser("userId123", {
          _id: "userId123",
          roles: [{ name: "admin" }],
          permissions: [{ name: "read" }, { name: "write" }],
        })
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if the user does not have access", async () => {
      const mockPreference = { user: "anotherUserId" } as IUserPreference;
      const mockCurrentUser: UserDataToJWT = {
        _id: "userId123",
        roles: [{ name: "admin" }],
        permissions: [{ name: "read" }, { name: "write" }],
      };
      (
        preferenceService.repository.getPreferenceByUser as jest.Mock
      ).mockResolvedValue(mockPreference);
      jest.spyOn(SecurityUtils, "isOwnerOrAdmin").mockReturnValue(false);

      await expect(
        preferenceService.getPreferenceByUser("userId123", mockCurrentUser)
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("createDefaultPreference", () => {
    it("should create and return default preferences for a user", async () => {
      const mockUser = { _id: "userId123", isDefaultPreference: true } as IUser;
      const mockPreference = { user: "userId123" } as IUserPreference;
      (preferenceService.repository.create as jest.Mock).mockResolvedValue(
        mockPreference
      );

      const result = await preferenceService.createDefaultPreference(mockUser);
      expect(result).toBe(mockPreference);
      expect(preferenceService.repository.create).toHaveBeenCalledWith({
        user: "userId123",
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        marketingConsent: true,
        cookiesConsent: false,
        personalizedAds: true,
        language: "fr",
        currency: "EUR",
      });
    });

    it("should throw BadRequestError if creation fails", async () => {
      const mockUser = { _id: "userId123", isDefaultPreference: true } as IUser;
      (preferenceService.repository.create as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        preferenceService.createDefaultPreference(mockUser)
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("updatePreference", () => {
    it("should update and return the preference", async () => {
      const mockPreference = { user: "userId123" } as IUserPreference;
      const mockUpdatedPreference = {
        user: "userId123",
        notifications: {},
      } as IUserPreference;
      const mockData = {
        notificationsEmail: true,
        notificationsSms: false,
        notificationsPush: true,
        marketingConsent: true,
        personalizedAds: true,
        language: "en",
        currency: "EUR",
      };
      const mockCurrentUser: UserDataToJWT = {
        _id: "userId123",
        roles: [{ name: "admin" }],
        permissions: [{ name: "read" }, { name: "write" }],
      };

      (preferenceService.repository.getById as jest.Mock).mockResolvedValue(
        mockPreference
      );
      (preferenceService.repository.updateById as jest.Mock).mockResolvedValue(
        mockUpdatedPreference
      );
      jest.spyOn(SecurityUtils, "isOwnerOrAdmin").mockReturnValue(true);

      const result = await preferenceService.updatePreference(
        "prefId123",
        mockData,
        mockCurrentUser
      );
      expect(result).toBe(mockUpdatedPreference);
      expect(preferenceService.repository.updateById).toHaveBeenCalledWith(
        "prefId123",
        mockData
      );
    });

    it("should throw BadRequestError if preference does not exist", async () => {
      (preferenceService.repository.getById as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        preferenceService.updatePreference(
          "prefId123",
          {},
          {
            _id: "userId123",
            roles: [{ name: "admin" }],
            permissions: [{ name: "read" }, { name: "write" }],
          }
        )
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if the user does not have access", async () => {
      const mockPreference = { user: "anotherUserId" } as IUserPreference;
      (preferenceService.repository.getById as jest.Mock).mockResolvedValue(
        mockPreference
      );
      jest.spyOn(SecurityUtils, "isOwnerOrAdmin").mockReturnValue(false);

      await expect(
        preferenceService.updatePreference(
          "prefId123",
          {},
          {
            _id: "userId123",
            roles: [{ name: "admin" }],
            permissions: [{ name: "read" }, { name: "write" }],
          }
        )
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("deletePreference", () => {
    it("should delete the preference", async () => {
      const mockPreference = {
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
        currency: "EUR",
      };

      (preferenceService.repository.getById as jest.Mock).mockResolvedValue(
        mockPreference
      );

      (preferenceService.repository.deleteById as jest.Mock).mockResolvedValue(
        true
      );

      await preferenceService.deletePreference("prefId123");

      expect(preferenceService.repository.deleteById).toHaveBeenCalledWith(
        "prefId123"
      );
    });

    it("should throw BadRequestError if preference does not exist", async () => {
      (preferenceService.repository.getById as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        preferenceService.deletePreference("prefId123")
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if deletion fails", async () => {
      const mockPreference = {
        user: "userId123",
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      };

      (preferenceService.repository.getById as jest.Mock).mockResolvedValue(
        mockPreference
      );

      (preferenceService.repository.deleteById as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        preferenceService.deletePreference("prefId123")
      ).rejects.toThrow(BadRequestError);
    });
  });
});
