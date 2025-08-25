import express from "express";
import { register, login, logout, refreshToken } from "../controllers/auth-controller.js";
 import { isAuthenticated } from "../../../middlewares/auth-driver-middleware.js";

const router = express.Router();
router.post("/new", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/auth/check", isAuthenticated, (req, res) => res.json({success: true, user: req.user }))
router.get("/auth/refresh", refreshToken); // Endpoint to refresh token

export default router;