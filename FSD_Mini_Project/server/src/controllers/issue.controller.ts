
import { Request, Response } from "express";
import mongoose from "mongoose";
import Issue from "../models/Issue";

export async function getIssues(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    console.error("Get issues error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issues"
    });
  }
}

export async function getIssueById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({
        success: false,
        message: "Invalid issue ID"
      });
      return;
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404).json({
        success: false,
        message: "Issue not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error("Get issue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issue"
    });
  }
}

export async function createIssue(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { title, category, location, description, priority, reportedBy } =
      req.body;

    if (
      !title?.trim() ||
      !category?.trim() ||
      !location?.trim() ||
      !description?.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Title, category, location and description are required"
      });
      return;
    }

    const allowedPriorities = ["Low", "Medium", "High"];
    const selectedPriority = priority || "Medium";

    if (!allowedPriorities.includes(selectedPriority)) {
      res.status(400).json({
        success: false,
        message: "Invalid priority"
      });
      return;
    }

    const issue = await Issue.create({
      title: title.trim(),
      category: category.trim(),
      location: location.trim(),
      description: description.trim(),
      priority: selectedPriority,
      reportedBy:
        typeof reportedBy === "string" ? reportedBy.trim() : undefined
    });

    res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      data: issue
    });
  } catch (error) {
    console.error("Create issue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create issue"
    });
  }
}
