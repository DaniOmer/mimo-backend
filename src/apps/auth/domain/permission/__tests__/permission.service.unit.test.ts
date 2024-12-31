import PermissionService from "../permission.service";
import PermissionRepository from "../../../data-access/permission/permission.repository";
import { IPermission } from "../../../data-access/permission/permission.interface";
import BadRequestError from "../../../../../config/error/bad.request.config";

jest.mock("../../../data-access/permission/permission.repository");

describe("PermissionService", () => {
  let permissionService: PermissionService;
  let mockPermissionRepository: jest.Mocked<PermissionRepository>;

  beforeEach(() => {

    mockPermissionRepository = new PermissionRepository() as jest.Mocked<PermissionRepository>;
    permissionService = new PermissionService();
    (permissionService as any).permissionRepository = mockPermissionRepository;

    jest.clearAllMocks();
  });

  describe("getAllPermissions", () => {
    it("should return an array of permissions", async () => {
      const mockPermissions = [
        { _id: "123", name: "READ_USER" } as IPermission,
        { _id: "456", name: "WRITE_USER" } as IPermission,
      ];
      mockPermissionRepository.getAll.mockResolvedValue(mockPermissions);

      const result = await permissionService.getAllPermissions();
      expect(result).toEqual(mockPermissions);
      expect(mockPermissionRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("createPermission", () => {
    it("should create a new permission if it does not exist", async () => {
      const permissionDTO = { name: "NEW_PERMISSION" };
      mockPermissionRepository.getByName.mockResolvedValue(null); 
      mockPermissionRepository.create.mockResolvedValue({
        _id: "mockId",
        name: "NEW_PERMISSION",
      } as IPermission);

      const result = await permissionService.createPermission(permissionDTO);
      expect(result).toHaveProperty("_id");
      expect(result.name).toBe("NEW_PERMISSION");
      expect(mockPermissionRepository.create).toHaveBeenCalledWith(
        permissionDTO
      );
    });

    it("should throw an error if permission already exists", async () => {
      const permissionDTO = { name: "EXISTING_PERMISSION" };
      mockPermissionRepository.getByName.mockResolvedValue({
        _id: "123",
        name: "EXISTING_PERMISSION",
      } as IPermission);

      await expect(
        permissionService.createPermission(permissionDTO)
      ).rejects.toThrow(BadRequestError);

      expect(mockPermissionRepository.create).not.toHaveBeenCalled();
    });
  });
});
