import express from "express";
import { checkUser, userById } from "./user.controller.js";

const router = express.Router();

router.post("/checkToken", checkUser);
router.get("/:id", userById);

export const userRouter = router;
