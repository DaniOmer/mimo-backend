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
import categoryRouter from "./apps/product/api/category/category.route";
import sizeRouter from "./apps/product/api/size/size.route";
import colorRouter from "./apps/product/api/color/color.route";
import paymentRouter from "./apps/payment/api/payment.route";
import inventoryRouter from "./apps/product/api/inventory/inventory.route";
import ProductFeatureRouter from "./apps/product/api/productFeature/productFeature.route";
import ProductImageRouter from "./apps/product/api/productImage/productImage.route";
import ProductVariantRouter from "./apps/product/api/productVariant/productVariant.route";


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


    // Inventory routes
    app.use("/api/products/inventory", inventoryRouter);

  
    // category routes
    app.use("/api/categories", categoryRouter);

    // Size routes
    app.use("/api/sizes", sizeRouter);

    // Color routes
    app.use("/api/colors", colorRouter);


    // User routes
    app.use("/api/users", userRouter);

    // Permission routes
    app.use("/api/permissions", permissionRouter);

    // Role routes
    app.use("/api/roles", roleRouter);

    // Payment routes
    app.use("/api/payment", paymentRouter);

    // Product Feature routes
    app.use("/api/product-features", ProductFeatureRouter);

    // Product Image routes
    app.use("/api/product-images", ProductImageRouter);

    // Product Variant routes
    app.use("/api/product-variants", ProductVariantRouter);

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
