import express from "express";
import { LoginUser, activateUser, getUserInfo, logoutUser, reegistrationUser, sosialAuth, upadteAccessToken, updatePassword, updateProfilePicture, updateUserInfo } from "../controllers/user.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
const userRouter = express.Router();


userRouter.post('/activate-user', activateUser);
userRouter.post('/registration', reegistrationUser);
userRouter.post('/login', LoginUser);
userRouter.post('/social-auth', sosialAuth);
userRouter.get('/logout',isAutheticated, logoutUser);
userRouter.get('/refresh',  upadteAccessToken);
userRouter.get('/me',isAutheticated, getUserInfo);
userRouter.put('/update-user-info',isAutheticated, updateUserInfo);
userRouter.put('/update-password',isAutheticated, updatePassword);
userRouter.put('/update-user-avatar',isAutheticated, updateProfilePicture);

export default userRouter;