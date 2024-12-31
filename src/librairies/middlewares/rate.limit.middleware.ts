import { rateLimit } from "express-rate-limit";

export const rateLimiterMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many requests, please try again later",
});
