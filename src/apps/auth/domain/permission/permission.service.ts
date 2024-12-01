import { BaseService } from "../../../../librairies/services";
import { IPermission } from "../../data-access/permission/permission.interface";
import PermissionRepository from "../../data-access/permission/permission.repository";
import { PermissionCreateDTO } from "./permission.dto";
import BadRequestError from "../../../../config/error/bad.request.config";

export default class PermissionService extends BaseService {
  private readonly permissionRepository: PermissionRepository;

  constructor() {
    super("Permission");
    this.permissionRepository = new PermissionRepository();
  }

  async getAllPermissions(): Promise<IPermission[]> {
    return await this.permissionRepository.getAll();
  }

  async createPermission(
    permission: PermissionCreateDTO
  ): Promise<IPermission> {
    const existingPerm = await this.permissionRepository.getByName(
      permission.name
    );
    if (existingPerm) {
      throw new BadRequestError({
        message: "Permission already exists",
        context: { field_validation: ["name"] },
        logging: true,
      });
    }

    return await this.permissionRepository.create(permission);
  }
}
