import cors from "cors";
import { AppConfig } from "../../config/app.config";
import BadRequestError from "../../config/error/bad.request.config";

const corsCredentials = process.env.CORS_CREDENTIALS === "true";

export const corsMiddleware = cors({
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow: boolean) => void
  ): void {
    if (origin) {
      origin = origin.trim();
    }
    if (
      origin &&
      AppConfig.cors.allowedOrigins &&
      AppConfig.cors.allowedOrigins.indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      callback(
        new BadRequestError({
          code: 403,
          message: "Origin not allowed by CORS policy",
          logging: true,
        }),
        false
      );
    }
  },
  // allowedHeaders: AppConfig.cors.allowedHeaders,
  // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: corsCredentials,
});
