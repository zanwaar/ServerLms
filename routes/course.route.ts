import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCoureses,
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
courseRouter.put(
  "/add-replay",
  isAutheticated,
  authorizeRoles("admin"),
  addReplyToReview
);
courseRouter.get(
  "/get-courses",
  isAutheticated,
  authorizeRoles("admin"),
  getAllCoureses
);
courseRouter.delete(
  "/delete-course/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourse
);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourse);
courseRouter.get("/get-course-conten/:id", isAutheticated, getCourseByUser);
courseRouter.put("/add-question", isAutheticated, addQuestion);
courseRouter.put("/add-answer", isAutheticated, addAnswer);
courseRouter.put("/add-review/:id", isAutheticated, addReview);

export default courseRouter;
