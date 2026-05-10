export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  tags?: string[];
}

export type TaskStatus = Task["status"];
export type TaskPriority = Task["priority"];

export interface TaskFilters {
  searchText: string;
  status: TaskStatus[];
  priority: TaskPriority | "";
  dateRange: [string, string];
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  highPriority: number;
  overdue: number;
}

export interface SortConfig {
  key: keyof Task | "";
  dir: "asc" | "desc";
}
