import { BaseService } from "../../../../librairies/services";
import { IRole } from "../../data-access/role/role.interface";
import RoleRepository from "../../data-access/role/role.repository";
import PermissionService from "../permission/permission.service";
import BadRequestError from "../../../../config/error/bad.request.config";
import { RoleCreateDTO } from "./role.dto";

export default class RoleService extends BaseService {
  readonly roleRepository: RoleRepository;
  readonly permissionService: PermissionService;

  constructor() {
    super("Role");
    this.roleRepository = new RoleRepository();
    this.permissionService = new PermissionService();
  }

  async getRoleByName(name: string): Promise<IRole> {
    const role = await this.roleRepository.getByName(name);
    if (!role) {
      throw new BadRequestError({
        message: "Role not found",
        code: 404,
        context: {
          get_user_role: "Role with the given name does not exist",
        },
      });
    }
    return role;
  }

  async createRole(data: RoleCreateDTO): Promise<IRole> {
    const { permissions, ...roleData } = data;
    const isRoleExists = await this.roleRepository.getByName(data.name);
    if (isRoleExists) {
      throw new BadRequestError({
        message: "Role already exists",
        code: 400,
        context: {
          create_user_role: "Role with the same name already exists",
        },
      });
    }

    if (permissions && permissions.length) {
      const allPermissions = await this.permissionService.getAllPermissions();
      const existingPermissions = permissions
        .map((id) =>
          allPermissions.find((p) => p._id.toString() === id.toString())
        )
        .filter((p) => p !== undefined);

      if (existingPermissions.length !== permissions.length) {
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
        name: roleData.name,
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
    return await this.roleRepository.create(roleData);
  }
}
