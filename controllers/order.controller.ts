require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { getAllOrderService, newOrder } from "../service/orderService";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";

// create Order
export const createOder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      const user = await userModel.findById(req.user?._id);

      const courseExists = user?.courses.some((course: any) =>
        course._id.equals(courseId)
      );

      if (courseExists) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 400));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );
      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push(data.courseId);

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course.name}`,
        status: "undread",
      });

      course.puschased ? (course.puschased += 1) : course.puschased;
      await course.save();
      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// get all Order --- only admin
export const getAllOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrderService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
