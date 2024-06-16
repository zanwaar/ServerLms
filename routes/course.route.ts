import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { editCourse, uploadCourse } from "../controllers/course.controller";
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

export default courseRouter;
