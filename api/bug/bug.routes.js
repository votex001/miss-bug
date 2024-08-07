import express from "express";
import {
  deleteBug,
  downloadBug,
  getBug,
  getBugs,
  postBug,
  putBug,
  trackVisitedBugs,
} from "./bug.controller.js";
import { requireAuth } from "../../middlewares/require-auth.middleware.js";

const router = express.Router();

router.get("/", getBugs);
router.get("/:bugId", trackVisitedBugs, getBug);
router.get("/:bugId/download", downloadBug);
router.post("/", requireAuth, postBug);
router.put("/", requireAuth, putBug);
router.delete("/:bugId", requireAuth, deleteBug);

export const bugRoutes = router;
