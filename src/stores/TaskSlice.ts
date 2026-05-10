import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskFilters, SortConfig } from "../types";
import { MOCK_TASKS } from "../data/mockData";

interface TasksState {
  items: Task[];
  filters: TaskFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
  sortConfig: SortConfig;
}

const initialState: TasksState = {
  items: MOCK_TASKS,
  filters: {
    searchText: "",
    status: [],
    priority: "",
    dateRange: ["", ""],
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },
  sortConfig: {
    key: "createdAt",
    dir: "desc",
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.items.unshift(action.payload);
      state.pagination.currentPage = 1;
    },
    updateTask(state, action: PayloadAction<Partial<Task> & { id: string }>) {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    deleteManyTasks(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload);
      state.items = state.items.filter((t) => !ids.has(t.id));
    },
    updateTaskStatus(
      state,
      action: PayloadAction<{ id: string; status: Task["status"] }>,
    ) {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
    setFilter(state, action: PayloadAction<Partial<TaskFilters>>) {
      Object.assign(state.filters, action.payload);
      state.pagination.currentPage = 1;
    },
    resetFilters(state) {
      state.filters = {
        searchText: "",
        status: [],
        priority: "",
        dateRange: ["", ""],
      };
      state.pagination.currentPage = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
    },
    setSortConfig(state, action: PayloadAction<SortConfig>) {
      state.sortConfig = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  deleteManyTasks,
  updateTaskStatus,
  setFilter,
  resetFilters,
  setPage,
  setSortConfig,
} = tasksSlice.actions;

export default tasksSlice.reducer;

// ─── Base selectors ──────────────────────────────────────────────────────────
const selectItems = (state: { tasks: TasksState }) => state.tasks.items;
const selectFilters = (state: { tasks: TasksState }) => state.tasks.filters;
const selectPagination = (state: { tasks: TasksState }) =>
  state.tasks.pagination;
const selectSortConfig = (state: { tasks: TasksState }) =>
  state.tasks.sortConfig;

// ─── Derived selectors ───────────────────────────────────────────────────────
export const selectAllTasks = createSelector([selectItems], (items) => [
  ...items,
]);

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters, selectSortConfig],
  (tasks, filters, sort) => {
    let result = tasks;

    if (filters.searchText) {
      const q = filters.searchText.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q) ||
          (t.assignee ?? "").toLowerCase().includes(q) ||
          (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    if (filters.status.length > 0) {
      result = result.filter((t) => filters.status.includes(t.status));
    }

    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.dateRange[0] && filters.dateRange[1]) {
      result = result.filter(
        (t) =>
          t.dueDate &&
          t.dueDate >= filters.dateRange[0] &&
          t.dueDate <= filters.dateRange[1],
      );
    }

    const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
    result = [...result].sort((a, b) => {
      if (!sort.key) return 0;
      let va: string | number = (a[sort.key as keyof Task] as string) ?? "";
      let vb: string | number = (b[sort.key as keyof Task] as string) ?? "";
      if (sort.key === "priority") {
        va = priorityMap[va as string] ?? 0;
        vb = priorityMap[vb as string] ?? 0;
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });

    return result;
  },
);

export const selectPaginatedTasks = createSelector(
  [selectFilteredTasks, selectPagination],
  (tasks, { currentPage, pageSize }) => {
    const start = (currentPage - 1) * pageSize;
    return tasks.slice(start, start + pageSize);
  },
);

export const selectTaskStats = createSelector([selectItems], (items) => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: items.length,
    todo: items.filter((t) => t.status === "todo").length,
    inProgress: items.filter((t) => t.status === "in_progress").length,
    done: items.filter((t) => t.status === "done").length,
    highPriority: items.filter(
      (t) => t.priority === "high" && t.status !== "done",
    ).length,
    overdue: items.filter(
      (t) => t.dueDate && t.dueDate < today && t.status !== "done",
    ).length,
  };
});

export const selectRecentTasks = createSelector([selectItems], (items) =>
  [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
);

export const selectKanbanTasks = createSelector([selectItems], (items) => ({
  todo: items.filter((t) => t.status === "todo"),
  in_progress: items.filter((t) => t.status === "in_progress"),
  done: items.filter((t) => t.status === "done"),
}));

export const selectPaginationInfo = selectPagination;
export const selectFiltersState = selectFilters;
export const selectSortState = selectSortConfig;
