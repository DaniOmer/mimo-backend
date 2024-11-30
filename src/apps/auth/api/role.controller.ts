import { Request, Response, NextFunction } from "express";
import BaseController from "../../../librairies/controllers/base.controller";
import RoleService from "../domain/role.service";
import { ApiResponse } from "../../../librairies/controllers/api.response";

export default class RoleController extends BaseController {
  private roleService: RoleService;

  constructor() {
    super();
    this.roleService = new RoleService();
  }

  async createRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { permissions, ...roleData } = req.body;
      const createdRole = await this.roleService.createRole(
        roleData,
        permissions
      );
      ApiResponse.success(res, "Role created successfully", createdRole, 201);
    } catch (error) {
      next(error);
    }
  }
}
