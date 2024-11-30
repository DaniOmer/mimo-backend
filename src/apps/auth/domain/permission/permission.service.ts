import { BaseService } from "../../../../librairies/services";
import { IPermission } from "../../data-access/permission/permission.interface";
import PermissionRepository from "../../data-access/permission/permission.repository";

type PermissionCreate = Omit<IPermission, "_id" | "createdAt" | "updatedAt">;

export default class PermissionService extends BaseService {
  private readonly permissionRepository: PermissionRepository;

  constructor() {
    super("Permission");
    this.permissionRepository = new PermissionRepository();
  }

  async getAllPermissions(): Promise<IPermission[]> {
    return await this.permissionRepository.getAll();
  }

  async createPermission(permission: PermissionCreate): Promise<IPermission> {
    return await this.permissionRepository.create(permission);
  }
}
