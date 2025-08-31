import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, verifyEmail } from "../controllers/authController.js";



const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/verify-account', verifyEmail );
authRouter.post('/is-auth', isAuthenticated );
authRouter.post('/send-reset-otp', sendResetOtp );
authRouter.post('/reset-password', resetPassword );



export default authRouter;  