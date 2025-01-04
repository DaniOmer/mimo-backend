import { Router } from "express";
import { PreferenceController } from "./preference.controller";
import {
  authenticateMiddleware,
  validateIdMiddleware,
} from "../../../librairies/middlewares";

const router = Router();
const controller = new PreferenceController();

router.put(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("Preference"),
  controller.updateUserPreference.bind(controller)
);
