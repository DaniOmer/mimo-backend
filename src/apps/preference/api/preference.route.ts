import { Router } from "express";
import { PreferenceController } from "./preference.controller";
import {
  authenticateMiddleware,
  validateIdMiddleware,
  checkRoleMiddleware,
} from "../../../librairies/middlewares";

const router = Router();
const controller = new PreferenceController();

router.get(
  "/:userId",
  authenticateMiddleware,
  controller.getUserPreferences.bind(controller)
);

router.put(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("Preference"),
  controller.updateUserPreference.bind(controller)
);

router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Preference"),
  controller.deleteUserPreference.bind(controller)
);

export default router;
