import Router from "express";
import { AddressController } from "./address.controller";
import {
  authenticateMiddleware,
  validateDtoMiddleware,
  validateIdMiddleware,
} from "../../../librairies/middlewares";
import { AddressDTO } from "../domain";

const router = Router();
const controller = new AddressController();

router.get(
  "/me",
  authenticateMiddleware,
  controller.getAddressesByUser.bind(controller)
);

router.post(
  "/",
  authenticateMiddleware,
  validateDtoMiddleware(AddressDTO),
  controller.createAddress.bind(controller)
);

router.put(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("Address"),
  validateDtoMiddleware(AddressDTO),
  controller.updateAddress.bind(controller)
);

router.delete(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("Address"),
  controller.deleteAddress.bind(controller)
);

export default router;
