require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../service/courseService";
import CourseModel, { IComment } from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";

//Upluad Course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const mycloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// Edit Course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const mycloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        };
      }
      const courseId = req.params.id;

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get singel Course
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get(req.params.id);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set(req.params.id, JSON.stringify(course));
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
//get all  Course
export const getAllCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");
      if (isCacheExist) {
        const coureses = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          coureses,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set("allCourses", JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get course conten -- only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCouresList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCouresList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(new ErrorHandler("your are not eligible to access", 404));
      }

      const course = await CourseModel.findById(courseId);
      const conten = course?.courseData;

      res.status(200).json({
        success: true,
        conten,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add question in course
interface IaddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body as IaddQuestionData;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.courseData?.find(
        (item: any) => item._id.toString() === contentId
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      //create new object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      couseContent.questions.push(newQuestion);

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// add answer question in course question
interface IaddAnswerBodyData {
  answer: string;
  questionId: string;
  courseId: string;
  contentId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, questionId, courseId, contentId } =
        req.body as IaddAnswerBodyData;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.courseData?.find(
        (item: any) => item._id.toString() === contentId
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const question = couseContent?.questions?.find((item: any) => item._id.toString() === questionId);

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      //create new object
      const newAnswer : any = {
        user: req.user,
        answer,
      };

      (question as any).questionReplies.push(newAnswer);

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
