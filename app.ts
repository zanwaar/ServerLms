import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import { IUser } from "./models/user.model";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

//cors => orgin resourse sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// routes
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRouter);

// testing api
app.get("/test", (reg: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "api is working",
  });
});

// unknown route
app.all("*", (reg: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Router ${reg.originalUrl} nOT found`) as any;
  err.statusCode = 400;
  next(err);
});

app.use(ErrorMiddleware);
