import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { createOder } from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAutheticated, createOder);

export default orderRouter;
