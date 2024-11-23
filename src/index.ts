import express, { Express, Router } from "express";
import swaggerUi from "swagger-ui-express";

import { AppConfig } from "./config/app.config";
import { swaggerDocs } from "./config/swagger/swagger";
import { LoggerConfig } from "./config/logger/logger.config";
import { MongooseConfig } from "./config/mongoose/mongoose.config";
import authRoute from "./apps/auth/api/auth.route";
import { errorHandler } from "./librairies/middlewares/error.middleware";

async function startApp() {
  const app: Express = express();
  const port = AppConfig.server.port;
  const router: Router = Router();
  const loggerInit = LoggerConfig.get();

  try {
    const databaseInit = await MongooseConfig.get();

    app.use(express.json());

    // API documentation
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Authentication routes
    app.use("/api/auth", authRoute(router));

    // Error handling middleware
    app.use(errorHandler as express.ErrorRequestHandler);

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
