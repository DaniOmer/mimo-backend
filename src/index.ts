import express, { Express, Router } from "express";
import swaggerUi from "swagger-ui-express";
import { AppConfig } from "./config/app.config";
import { swaggerDocs } from "./config/swagger/swagger";
import { LoggerConfig } from "./config/logger/logger.config";
import { MongooseConfig } from "./config/mongoose/mongoose.config";
import authRoute from "./apps/auth/api/auth.route";
import userRoute from "./apps/auth/api/user.route";
import { corsMiddleware } from "./librairies/middlewares/cors.middleware";
import { rateLimiterMiddleware } from "./librairies/middlewares/rate.limit.middleware";
import { errorHandlerMiddleware } from "./librairies/middlewares/error.middleware";
import productRoutes from "./apps/product/api/product.route";

async function startApp() {
  const app: Express = express();
  const port = AppConfig.server.port;
  const router: Router = Router();
  const loggerInit = LoggerConfig.get();

  try {
    const databaseInit = await MongooseConfig.get();

    // Json configuration
    app.use(express.json());

    // CORS middleware
    app.use(corsMiddleware);

    // Rate limiting middleware
    app.use(rateLimiterMiddleware);

    // API documentation
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Authentication routes
    app.use("/api/auth", authRoute(router));

    // Product routes
    app.use("/api/products", productRoutes);

    // User routes
    app.use("/api/users", userRoute);



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
