import { MongooseConfig } from "../mongoose/mongoose.config";
import RoleRepository from "../../apps/auth/data-access/role/role.repository";
import { IPermission } from "../../apps/auth/data-access";
import PermissionRepository from "../../apps/auth/data-access/permission/permission.repository";

const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();

async function initRolesAndPermissions() {
  try {
    await MongooseConfig.get();

    const existingRoles = await roleRepository.getAll();
    if (existingRoles.length > 0) {
      console.log("Init roles already exist. Nothing to change.");
      process.exit(0);
    }

    const permissionsData = [
      { name: "read" },
      { name: "write" },
      { name: "update" },
      { name: "delete" },
    ];

    const permissions = await Promise.all(
      permissionsData.map((permission) =>
        permissionRepository.create(permission)
      )
    );
    console.log("Permissions created:", permissions);

    const adminRole = await roleRepository.create({
      name: "admin",
      permissions: permissions.map((permission: IPermission) => permission),
    });

    console.log("Admin role created:", adminRole);
    process.exit(0);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    process.exit(1);
  }
}

initRolesAndPermissions();
