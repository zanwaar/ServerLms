import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  addQuestion,
  editCourse,
  getAllCourse,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAutheticated,
  authorizeRoles("admin"),
  uploadCourse
);
courseRouter.put(
  "/edit-course/:id",
  isAutheticated,
  authorizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourse);
courseRouter.get("/get-course-conten/:id", isAutheticated, getCourseByUser);
courseRouter.put("/add-question", isAutheticated, addQuestion);

export default courseRouter;
