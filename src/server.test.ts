import express from "express";
import authRoutes from "./apps/auth/api/auth/auth.route";
import userRoutes from "./apps/auth/api/user/user.route";
import roleRoutes from "./apps/auth/api/role/role.route";
import permissionRoutes from "./apps/auth/api/permission/permission.route";
import { errorHandlerMiddleware } from "./librairies/middlewares/error.middleware";


export const createTestServer = (): express.Application => {
  const app = express();

  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/roles", roleRoutes);
  app.use("/api/permissions", permissionRoutes);

  app.use(errorHandlerMiddleware);

  return app;
};
