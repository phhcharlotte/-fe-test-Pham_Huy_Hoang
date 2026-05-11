import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskFilters, SortConfig } from "../types";
import { MOCK_TASKS } from "../data/mockData";

export type LoadingKey =
  | "filter"
  | "addTask"
  | "updateTask"
  | "deleteTask"
  | "deleteManyTasks"
  | "updateStatus";

interface TasksState {
  items: Task[];
  filters: TaskFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
  };
  sortConfig: SortConfig;
  loading: LoadingKey[];
}

const defaultFilters: TaskFilters = {
  searchText: "",
  status: [],
  priority: "",
  dateRange: ["", ""],
};

const initialState: TasksState = {
  items: MOCK_TASKS,
  filters: defaultFilters,
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },
  sortConfig: {
    key: "createdAt",
    dir: "desc",
  },
  loading: [],
};

const removeLoading = (
  loading: LoadingKey[],
  key: LoadingKey,
): LoadingKey[] => {
  return loading.filter((item) => item !== key);
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    startLoading(state, action: PayloadAction<LoadingKey>) {
      if (!state.loading.includes(action.payload)) {
        state.loading.push(action.payload);
      }
    },
    stopLoading(state, action: PayloadAction<LoadingKey>) {
      state.loading = removeLoading(state.loading, action.payload);
    },
    addTask(state, action: PayloadAction<Task>) {
      state.items.unshift(action.payload);
      state.pagination.currentPage = 1;
      state.loading = removeLoading(state.loading, "addTask");
    },
    updateTask(state, action: PayloadAction<Partial<Task> & { id: string }>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index >= 0) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
      state.loading = removeLoading(state.loading, "updateTask");
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.loading = removeLoading(state.loading, "deleteTask");
    },
    deleteManyTasks(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload);
      state.items = state.items.filter((item) => !ids.has(item.id));
      state.loading = removeLoading(state.loading, "deleteManyTasks");
    },
    updateTaskStatus(
      state,
      action: PayloadAction<{ id: string; status: Task["status"] }>,
    ) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task) task.status = action.payload.status;
      state.loading = removeLoading(state.loading, "updateStatus");
    },
    setFilter(state, action: PayloadAction<Partial<TaskFilters>>) {
      Object.assign(state.filters, action.payload);
      state.pagination.currentPage = 1;
    },
    resetFilters(state) {
      state.filters = defaultFilters;
      state.pagination.currentPage = 1;
      state.loading = removeLoading(state.loading, "filter");
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
      state.loading = removeLoading(state.loading, "filter");
    },
    setSortConfig(state, action: PayloadAction<SortConfig>) {
      state.sortConfig = action.payload;
    },
  },
});

export const {
  startLoading,
  stopLoading,
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

const selectItems = (state: { tasks: TasksState }) => state.tasks.items;
const selectFilters = (state: { tasks: TasksState }) => state.tasks.filters;
const selectPagination = (state: { tasks: TasksState }) =>
  state.tasks.pagination;
const selectSortConfig = (state: { tasks: TasksState }) =>
  state.tasks.sortConfig;
const selectLoading = (state: { tasks: TasksState }) => state.tasks.loading;

export const selectIsLoading = (key: LoadingKey) =>
  createSelector([selectLoading], (loading) => loading.includes(key));

export const selectAnyLoading = createSelector(
  [selectLoading],
  (loading) => loading.length > 0,
);

export const selectAllTasks = createSelector([selectItems], (items) => items);

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters, selectSortConfig],
  (tasks, filters, sort) => {
    let result = tasks;

    if (filters.searchText) {
      const keyWord = filters.searchText.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(keyWord) ||
          (item.description ?? "").toLowerCase().includes(keyWord) ||
          (item.assignee ?? "").toLowerCase().includes(keyWord) ||
          (item.tags ?? []).some((tag) => tag.toLowerCase().includes(keyWord)),
      );
    }

    if (filters.status.length > 0) {
      result = result.filter((item) => filters.status.includes(item.status));
    }

    if (filters.priority) {
      result = result.filter((item) => item.priority === filters.priority);
    }

    if (filters.dateRange[0] && filters.dateRange[1]) {
      result = result.filter(
        (item) =>
          item.dueDate &&
          item.dueDate >= filters.dateRange[0] &&
          item.dueDate <= filters.dateRange[1],
      );
    }

    const priorityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
    result = [...result].sort((a, b) => {
      if (!sort.key) return 0;
      let vala: string | number = (a[sort.key as keyof Task] as string) ?? "";
      let valb: string | number = (b[sort.key as keyof Task] as string) ?? "";
      if (sort.key === "priority") {
        vala = priorityMap[vala as string] ?? 0;
        valb = priorityMap[valb as string] ?? 0;
      }
      const compareResult = vala < valb ? -1 : vala > valb ? 1 : 0;
      return sort.dir === "asc" ? compareResult : -compareResult;
    });

    return result;
  },
);

export const selectPaginatedTasks = createSelector(
  [selectFilteredTasks, selectPagination],
  (tasks, pagination) => {
    const { currentPage, pageSize } = pagination;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return tasks.slice(startIndex, endIndex);
  },
);

export const selectTaskStats = createSelector([selectItems], (items) => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: items.length,
    todo: items.filter((item) => item.status === "todo").length,
    inProgress: items.filter((item) => item.status === "in_progress").length,
    done: items.filter((item) => item.status === "done").length,
  };
});

export const selectRecentTasks = createSelector([selectItems], (items) => {
  return [...items]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
});
export const selectPaginationInfo = selectPagination;
export const selectFiltersState = selectFilters;
