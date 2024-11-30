import { permission } from "process";
import { BaseService } from "../../../librairies/services";
import { IRole } from "../data-access/role.interface";
import RoleRepository from "../data-access/role.repository";
import PermissionService from "./permission.service";
import BadRequestError from "../../../config/error/bad.request.config";
import { ObjectId } from "mongoose";

type RoleCreate = Omit<IRole, "_id" | "createdAt" | "updatedAt">;

export default class RoleService extends BaseService {
  readonly roleRepository: RoleRepository;
  readonly permissionService: PermissionService;

  constructor() {
    super("Role");
    this.roleRepository = new RoleRepository();
    this.permissionService = new PermissionService();
  }

  async createRole(
    role: RoleCreate,
    permissionIds?: ObjectId[]
  ): Promise<IRole> {
    const isRoleExists = await this.roleRepository.getByName(role.name);
    if (isRoleExists) {
      throw new BadRequestError({
        message: "Role already exists",
        code: 400,
        context: {
          create_user_role: "Role with the same name already exists",
        },
      });
    }

    if (permissionIds && permissionIds.length) {
      const allPermissions = await this.permissionService.getAllPermissions();
      const existingPermissions = permissionIds
        .map((id) =>
          allPermissions.find((p) => p._id.toString() === id.toString())
        )
        .filter((p) => p !== undefined);

      if (existingPermissions.length !== permissionIds.length) {
        throw new BadRequestError({
          message: "Invalid permissions",
          code: 400,
          context: {
            create_user_role: "One or more permissions does not exist",
          },
          logging: true,
        });
      }
      const roleWithPermissions = {
        name: role.name,
        permissions: existingPermissions.map((p) => p.toObject()._id),
      };
      const createdRole = await this.roleRepository.create(roleWithPermissions);
      const createdRoleWithPermissions =
        await this.roleRepository.getRoleByIdWithPermissions(createdRole._id);

      if (!createdRoleWithPermissions) {
        throw new BadRequestError({
          message: "Failed to create role with permissions",
          code: 500,
          context: {
            create_user_role: "Failed to create role with permissions",
          },
          logging: true,
        });
      }
      return createdRoleWithPermissions;
    }
    return await this.roleRepository.create(role);
  }
}
