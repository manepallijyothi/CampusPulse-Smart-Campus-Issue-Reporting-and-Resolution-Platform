
const API_BASE_URL = "/api";

export type IssueStatus = "Pending" | "In Progress" | "Resolved";
export type IssuePriority = "Low" | "Medium" | "High";

export interface Issue {
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  reportedBy?: string;
  assignedTo?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

export interface CreateIssueData {
  title: string;
  category: string;
  location: string;
  description: string;
  priority: IssuePriority;
  reportedBy?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    credentials: "include"
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed. Please try again.");
  }

  return result as ApiResponse<T>;
}

export async function getIssues(): Promise<Issue[]> {
  const result = await request<Issue[]>("/issues");
  return result.data;
}

export async function getIssueById(id: string): Promise<Issue> {
  const result = await request<Issue>(`/issues/${id}`);
  return result.data;
}

export async function createIssue(
  issueData: CreateIssueData
): Promise<Issue> {
  const result = await request<Issue>("/issues", {
    method: "POST",
    body: JSON.stringify(issueData)
  });

  return result.data;
}
