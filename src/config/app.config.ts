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
    apiUrl: process.env.API_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET_CURRENT,
    expiresIn: "7d",
  },
  token: {
    defaultExpiresIn: process.env.TOKEN_DEFAULT_EXPIRATION || 86400,
  },
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
    credentials: process.env.CORS_CREDENTIALS,
  },
  client: {
    url: process.env.CLIENT_URL,
  },
  notification: {
    email: {
      brevoApiKey: process.env.BREVO_API_KEY,
      fromEmail: process.env.BREVO_FROM_EMAIL,
      fromName: process.env.BREVO_FROM_NAME,
    },
  },
  store: {
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
    },
  },
};
