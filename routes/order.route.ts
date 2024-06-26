import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { createOder, getAllOrder } from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAutheticated, createOder);
orderRouter.get(
    "/get-orders",
    isAutheticated,
    authorizeRoles("admin"),
    getAllOrder
  );

export default orderRouter;
