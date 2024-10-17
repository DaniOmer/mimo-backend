import dotenv from "dotenv";

import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

import connectDb from "./config/db";

import userRoutes from "./apps/users/api/userRoute";
import { swaggerOptions } from "./config/swagger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Swagger Configuration
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
  try {
    res.send(`Express + TypeScript Server`);
  } catch (error) {
    console.log(`User creation failed: ${error}`);
  }
});

app.use("/api", userRoutes);

app.listen(port, () => {
  connectDb();
  console.log(
    `Example app listening on port http://localhost:${port}. Connect`
  );
});
