require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";



// create Order
export const createOder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {courseId, payment_info} = req.body as IOrder

        const user = await userModel.findById(req.user?._id)

        const courseExists = user?.courses.some((course:any) => course._id.equals(courseId));
         

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);