// routes/authRoutes.js
import express from "express";
import { login, signup, requestReset, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// auth routes
router.post("/signup", signup);
router.post("/login", login);

// simple reset password (no email, just code for demo)
router.post("/reset-password-request", requestReset); 
router.post("/reset-password", resetPassword); 
export default router;
