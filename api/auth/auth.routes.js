import express from "express";
import { checkUser, login, logout, signup } from "./auth.controller.js";

const router = express.Router();

router.post("/login",login)
router.post("/signup",signup)
router.post("/logout",logout)
router.post("/checkToken",checkUser)









export const authRoutes = router;
