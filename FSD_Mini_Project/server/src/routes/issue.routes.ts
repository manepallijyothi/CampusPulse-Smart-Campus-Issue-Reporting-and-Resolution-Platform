
import { Router } from "express";
import {
  getIssues,
  getIssueById,
  createIssue
} from "../controllers/issue.controller";

const router = Router();

router.get("/", getIssues);
router.get("/:id", getIssueById);
router.post("/", createIssue);

export default router;
