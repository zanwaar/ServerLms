import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import courseModel from "../models/course.model";

export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await courseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);
// get all users
export const getAllCourseService = async (res: Response) => {
  const course = await courseModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    course,
  });
};
