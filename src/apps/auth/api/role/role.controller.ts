import { Request, Response, NextFunction } from "express";
import BaseController from "../../../../librairies/controllers/base.controller";
import RoleService from "../../domain/role/role.service";
import { ApiResponse } from "../../../../librairies/controllers/api.response";
import { RoleCreateDTO } from "../../domain";

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
      const createdRole = await this.roleService.createRole(req.body);
      ApiResponse.success(res, "Role created successfully", createdRole, 201);
    } catch (error) {
      next(error);
    }
  }
}
