import dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  logger: {
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
  },
  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {
      auth: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
      },
      dbName: process.env.DATABASE_NAME,
    },
  },
  server: {
    port: process.env.PORT || 3000,
  },
};
