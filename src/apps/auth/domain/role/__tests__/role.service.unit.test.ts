// src/apps/auth/domain/role/__tests__/role.service.test.ts

import { Types, Schema } from "mongoose";
import RoleService from "../role.service";
import RoleRepository from "../../../data-access/role/role.repository";
import PermissionService from "../../permission/permission.service";
import { IRole } from "../../../data-access/role/role.interface";
import { IPermission } from "../../../data-access/permission/permission.interface";
import { RoleCreateDTO } from "../role.dto";
import BadRequestError from "../../../../../config/error/bad.request.config";

// Mocks
jest.mock("../../../data-access/role/role.repository");
jest.mock("../../permission/permission.service");

describe("RoleService", () => {
  let roleService: RoleService;
  let mockRoleRepository: jest.Mocked<RoleRepository>;
  let mockPermissionService: jest.Mocked<PermissionService>;

  beforeEach(() => {
    mockRoleRepository = new RoleRepository() as jest.Mocked<RoleRepository>;
    mockPermissionService = new PermissionService() as jest.Mocked<PermissionService>;

    roleService = new RoleService();
    (roleService as any).roleRepository = mockRoleRepository;
    (roleService as any).permissionService = mockPermissionService;

    jest.clearAllMocks();
  });

  describe("createRole", () => {
    it("should create a role with valid permissions", async () => {
      const perm1 = new Types.ObjectId("64f74eca2d6f58cd0d01de07") as unknown as Schema.Types.ObjectId;
      const perm2 = new Types.ObjectId("64f74eca2d6f58cd0d01de08") as unknown as Schema.Types.ObjectId;

      const data: RoleCreateDTO = {
        name: "editor",
        permissions: [perm1, perm2], 
      };

      mockRoleRepository.getByName.mockResolvedValue(null);

      mockPermissionService.getAllPermissions.mockResolvedValue([
        {
          _id: perm1,
          name: "READ",
          toObject: jest.fn().mockReturnValue({ _id: perm1, name: "READ" }), 
        } as unknown as IPermission,
        {
          _id: perm2,
          name: "WRITE",
          toObject: jest.fn().mockReturnValue({ _id: perm2, name: "WRITE" }), 
        } as unknown as IPermission,
      ]);

      mockRoleRepository.create.mockResolvedValue({
        _id: new Types.ObjectId("64f74eca2d6f58cd0d01de09") as unknown as Schema.Types.ObjectId,
        name: "editor",
        permissions: [perm1, perm2], 
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IRole);

      mockRoleRepository.getRoleByIdWithPermissions.mockResolvedValue({
        _id: new Types.ObjectId("64f74eca2d6f58cd0d01de09") as unknown as Schema.Types.ObjectId,
        name: "editor",
        permissions: [
          { _id: perm1, name: "READ" },
          { _id: perm2, name: "WRITE" },
        ],
      } as unknown as IRole);

      const createdRole = await roleService.createRole(data);

      expect(createdRole._id).toBeDefined();
      expect(createdRole.permissions).toHaveLength(2);
      expect(mockPermissionService.getAllPermissions).toHaveBeenCalledTimes(1);
      expect(mockRoleRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRoleRepository.getRoleByIdWithPermissions).toHaveBeenCalled();
    });
  });
});
