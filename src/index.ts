import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { AppConfig } from "./config/app.config";
import { swaggerDocs } from "./config/swagger/swagger";
import { LoggerConfig } from "./config/logger/logger.config";
import { MongooseConfig } from "./config/mongoose/mongoose.config";
import { corsMiddleware } from "./librairies/middlewares/cors.middleware";
import { rateLimiterMiddleware } from "./librairies/middlewares/rate.limit.middleware";
import { errorHandlerMiddleware } from "./librairies/middlewares/error.middleware";
import authRouter from "./apps/auth/api/auth/auth.route";
import userRouter from "./apps/auth/api/user/user.route";
import productRouter from "./apps/product/api/product.route";
import permissionRouter from "./apps/auth/api/permission/permission.route";
import roleRouter from "./apps/auth/api/role/role.route";
import paymentRouter from "./apps/payment/api/payment.route";
import invitationRouter from "./apps/auth/api/invitation/invitation.route";

async function startApp() {
  const app: Express = express();
  const port = AppConfig.server.port;
  const loggerInit = LoggerConfig.get();

  try {
    const databaseInit = await MongooseConfig.get();

    // Json configuration
    app.use(express.json());

    // API documentation
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // CORS middleware
    app.use(corsMiddleware);

    // Rate limiting middleware
    app.use(rateLimiterMiddleware);

    // Authentication routes
    app.use("/api/auth", authRouter);

    // Product routes
    app.use("/api/products", productRouter);

    // User routes
    app.use("/api/users", userRouter);

    // Permission routes
    app.use("/api/permissions", permissionRouter);

    // Role routes
    app.use("/api/roles", roleRouter);

    // Payment routes
    app.use("/api/payment", paymentRouter);

    //invitations routes
    app.use("/api/invitations", invitationRouter);

    // Error handling middleware
    app.use(errorHandlerMiddleware as express.ErrorRequestHandler);

    app.listen(port, () => {
      databaseInit.mongoose;
      loggerInit.logger.info(
        `Mimo app listening on port http://localhost:${port}.`
      );
    });
  } catch (error) {
    loggerInit.logger.error("Error starting the application:", error);
    process.exit(1);
  }
}

startApp();
