import { BaseService } from "../../../librairies/services";
import { IPermission } from "../data-access/permission.interface";
import PermissionRepository from "../data-access/permission.repository";

type PermissionCreate = Omit<IPermission, "_id" | "createdAt" | "updatedAt">;

export default class PermissionService extends BaseService {
  readonly permissionRepository: PermissionRepository;

  constructor() {
    super("Permission");
    this.permissionRepository = new PermissionRepository();
  }

  async createPermission(permission: PermissionCreate): Promise<IPermission> {
    return await this.permissionRepository.create(permission);
  }
}
