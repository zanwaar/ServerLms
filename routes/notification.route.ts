import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { createOder } from "../controllers/order.controller";
import {
  getNotification,
  updateNotification,
} from "../controllers/notification.controller";
const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAutheticated,
  authorizeRoles("admin"),
  getNotification
);
notificationRouter.put(
  "/update-notification/:id",
  isAutheticated,
  authorizeRoles("admin"),
  updateNotification
);

export default notificationRouter;
