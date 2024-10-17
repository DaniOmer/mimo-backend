import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  try {
    res.send(`Express + TypeScript Server`);
  } catch (error) {
    console.log(`User creation failed: ${error}`);
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening on port http://localhost:${port}. Connect`
  );
});
