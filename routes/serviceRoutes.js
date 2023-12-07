import express from "express";
const router = express.Router();
import {
  getIssues,
  createIssue,
  closeIssue,
} from "../controllers/serviceController.js";

router.route("/").get(getIssues).post(createIssue);
router.route("/:id").patch(closeIssue);

export default router;
