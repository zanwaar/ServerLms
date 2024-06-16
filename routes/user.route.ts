import express from "express";
import { LoginUser, activateUser, logoutUser, reegistrationUser, upadteAccessToken } from "../controllers/user.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
const userRouter = express.Router();


userRouter.post('/activate-user', activateUser);
userRouter.post('/registration', reegistrationUser);
userRouter.post('/login', LoginUser);
userRouter.get('/logout',isAutheticated, logoutUser);
userRouter.get('/refresh',  upadteAccessToken);

export default userRouter;