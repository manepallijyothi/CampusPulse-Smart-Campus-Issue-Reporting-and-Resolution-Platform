
import mongoose, { Schema, Document } from "mongoose";

export type IssueStatus = "Pending" | "In Progress" | "Resolved";
export type IssuePriority = "Low" | "Medium" | "High";

export interface IIssue extends Document {
  title: string;
  category: string;
  location: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  reportedBy?: string;
  assignedTo?: string;
  resolutionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
      maxlength: 150
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    reportedBy: {
      type: String,
      trim: true
    },
    assignedTo: {
      type: String,
      trim: true
    },
    resolutionNote: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Issue = mongoose.model<IIssue>("Issue", issueSchema);

export default Issue;
